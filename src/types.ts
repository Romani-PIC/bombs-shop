export interface Product {
  id: string;
  name: string;
  price_per_pack: number;
  items_per_pack: number;
  stock: number;
  sort_order: number;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Order {
  id: string;
  user_id: number;
  items: CartItem[]; // Теперь заказ хранит массив товаров
  subtotal: number;
  discount: number;
  delivery_cost: number;
  total: number;
  address: string;
  meeting_date: string;
  time_slot: string;
  status: string;
  created_at: string;
}

export interface Profile {
  telegram_id: number;
  petards: number;
  referred_by?: number;
  is_subscribed: boolean;
  quest_25_claimed: boolean;
}