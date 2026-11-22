import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { Product, Order } from "../types";
import { getUserId } from "../lib/telegram";

interface Store {
  products: Product[];
  orders: Order[];
  loadingProducts: boolean;
  loadProducts: () => Promise<void>;
  loadOrders: () => Promise<void>;
  subscribeRealtime: () => () => void;
  placeOrder: (payload: {
    product: Product;
    qty: number;
    subtotal: number;
    discount: number;
    total: number;
    address: string;
    meeting_date: string;
    time_slot: string;
    delivery_free: boolean;
  }) => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  products: [],
  orders: [],
  loadingProducts: true,

  async loadProducts() {
    set({ loadingProducts: true });
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    set({ products: data ?? [], loadingProducts: false });
  },

  async loadOrders() {
    const userId = getUserId();
    if (!userId) return;
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    set({ orders: data ?? [] });
  },

  subscribeRealtime() {
    const channel = supabase
      .channel("products-realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "products" },
        (payload) => {
          const updated = payload.new as Product;
          set({
            products: get().products.map((p) =>
              p.id === updated.id ? { ...p, stock: updated.stock } : p
            ),
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  },

  async placeOrder(payload) {
    const userId = getUserId();
    if (!userId) throw new Error("Не авторизован через Telegram");

    const { data: rpcData, error: rpcErr } = await supabase.rpc("decrement_stock", {
      p_id: payload.product.id,
      p_qty: payload.qty,
    });

    if (rpcErr) throw rpcErr;
    if (rpcData === false) throw new Error("Недостаточно товара");

    const { error: insertErr } = await supabase.from("orders").insert({
      user_id: userId,
      product_id: payload.product.id,
      product_name: payload.product.name,
      qty: payload.qty,
      subtotal: payload.subtotal,
      discount: payload.discount,
      total: payload.total,
      delivery_free: payload.delivery_free,
      address: payload.address,
      meeting_date: payload.meeting_date,
      time_slot: payload.time_slot,
      status: "pending",
    });

    if (insertErr) throw insertErr;
    await get().loadOrders();
  },
}));