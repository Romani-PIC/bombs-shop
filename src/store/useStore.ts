import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { Product, Order, Profile, CartItem } from "../types";
import { getUserId, tg } from "../lib/telegram";

interface Store {
  products: Product[];
  orders: Order[];
  profile: Profile | null;
  cart: CartItem[];
  loadingProducts: boolean;
  loadProducts: () => Promise<void>;
  loadOrders: () => Promise<void>;
  initProfile: () => Promise<void>;
  subscribeRealtime: () => () => void;
  addToCart: (product: Product, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (payload: { address: string; meeting_date: string; time_slot: string; total: number; subtotal: number; discount: number; delivery_cost: number; petards_used: number; }) => Promise<void>;
  claimQuestSubscribe: () => Promise<void>;
  claimQuest25: () => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  products: [],
  orders: [],
  profile: null,
  cart: [],
  loadingProducts: true,

  async loadProducts() {
    set({ loadingProducts: true });
    const { data } = await supabase.from("products").select("*").order("sort_order", { ascending: true });
    set({ products: data ?? [], loadingProducts: false });
  },

  async loadOrders() {
    const userId = getUserId();
    if (!userId) return;
    const { data } = await supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    set({ orders: data ?? [] });
  },

  async initProfile() {
    const userId = getUserId();
    if (!userId) return;
    const { data } = await supabase.from("profiles").select("*").eq("telegram_id", userId).single();
    
    if (!data) {
      let referredBy = null;
      if (tg?.initDataUnsafe?.start_param?.startsWith("ref_")) {
        referredBy = Number(tg.initDataUnsafe.start_param.replace("ref_", ""));
      }
      const { data: newProfile } = await supabase.from("profiles").insert({ telegram_id: userId, petards: 0, referred_by: referredBy }).select().single();
      if (newProfile) set({ profile: newProfile });
      
      if (referredBy) {
        const { data: refProfile } = await supabase.from("profiles").select("petards").eq("telegram_id", referredBy).single();
        if (refProfile) await supabase.from("profiles").update({ petards: refProfile.petards + 5 }).eq("telegram_id", referredBy);
      }
    } else {
      set({ profile: data });
    }
  },

  subscribeRealtime() {
    const channel = supabase.channel("products-realtime").on("postgres_changes", { event: "UPDATE", schema: "public", table: "products" }, (payload) => {
      const updated = payload.new as Product;
      set({ products: get().products.map((p) => p.id === updated.id ? { ...p, stock: updated.stock } : p) });
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  },

  addToCart(product, qty) {
    const cart = get().cart;
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      set({ cart: cart.map(item => item.product.id === product.id ? { ...item, qty: item.qty + qty } : item) });
    } else {
      set({ cart: [...cart, { product, qty }] });
    }
  },

  removeFromCart(productId) {
    set({ cart: get().cart.filter(item => item.product.id !== productId) });
  },

  clearCart() {
    set({ cart: [] });
  },

  async placeOrder(payload) {
    const userId = getUserId();
    if (!userId) throw new Error("Не авторизован");
    const cart = get().cart;
    if (cart.length === 0) throw new Error("Корзина пуста");

    // 1. Списываем остатки
    for (const item of cart) {
      const { error } = await supabase.rpc("decrement_stock", { p_id: item.product.id, p_qty: item.qty });
      if (error) throw new Error(`Ошибка склада: ${item.product.name}`);
    }

    // 2. Создаем заказ
    const { error: insertErr } = await supabase.from("orders").insert({
      user_id: userId, items: cart, subtotal: payload.subtotal, discount: payload.discount,

delivery_cost: payload.delivery_cost, total: payload.total, address: payload.address,
      meeting_date: payload.meeting_date, time_slot: payload.time_slot, status: "pending",
    });
    if (insertErr) throw insertErr;

    // 3. Списываем петарды
    if (payload.petards_used > 0 && get().profile) {
      await supabase.from("profiles").update({ petards: get().profile!.petards - payload.petards_used }).eq("telegram_id", userId);
    }

    // 4. Начисляем кэшбек (10% от суммы) пригласившему
    const { data: myProfile } = await supabase.from("profiles").select("referred_by").eq("telegram_id", userId).single();
    if (myProfile && myProfile.referred_by) {
      const cashbackRub = Math.floor(payload.total * 0.1);
      if (cashbackRub > 0) {
        const { data: refProfile } = await supabase.from("profiles").select("petards").eq("telegram_id", myProfile.referred_by).single();
        if (refProfile) await supabase.from("profiles").update({ petards: refProfile.petards + cashbackRub }).eq("telegram_id", myProfile.referred_by);
      }
    }

    get().clearCart();
    await get().loadOrders();
    await get().initProfile(); 
  },

  async claimQuestSubscribe() {
    const userId = getUserId();
    if (!userId || !get().profile) return;
    await supabase.from("profiles").update({ is_subscribed: true, petards: get().profile!.petards + 10 }).eq("telegram_id", userId);
    await get().initProfile();
  },

  async claimQuest25() {
    const userId = getUserId();
    if (!userId || !get().profile) return;
    await supabase.from("profiles").update({ quest_25_claimed: true, petards: get().profile!.petards + 500 }).eq("telegram_id", userId);
    await get().initProfile();
  }
}));