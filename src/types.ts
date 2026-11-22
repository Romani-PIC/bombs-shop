export interface Product {
  id: string;
  name: string;
  price_per_pack: number;
  items_per_pack: number;
  stock: number;
  sort_order: number;
}

export interface Order {
  id: string;
  user_id: number;
  product_id: string;
  product_name: string;
  qty: number;
  subtotal: number;
  discount: number;
  total: number;
  delivery_free: boolean;
  address: string;
  meeting_date: string;
  time_slot: string;
  status: string;
  created_at: string;
}