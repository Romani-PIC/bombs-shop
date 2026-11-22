import { useEffect, useState } from "react";
import { useStore } from "./store/useStore";
import BottomNav, { TabKey } from "./components/BottomNav";
import CatalogTab from "./components/tabs/CatalogTab";
import PromotionsTab from "./components/tabs/PromotionsTab";
import OrdersTab from "./components/tabs/OrdersTab";
import SupportTab from "./components/tabs/SupportTab";
import OrderScreen from "./components/order/OrderScreen";
import { Product } from "./types";

export default function App() {
  const [tab, setTab] = useState<TabKey>("catalog");
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const { loadProducts, loadOrders, subscribeRealtime } = useStore();

  useEffect(() => {
    loadProducts();
    loadOrders();
    const unsub = subscribeRealtime();
    return unsub;
  }, [loadProducts, loadOrders, subscribeRealtime]);

  if (orderProduct) {
    return <OrderScreen product={orderProduct} onClose={() => setOrderProduct(null)} />;
  }

  return (
    <div className="min-h-full pb-28 max-w-md mx-auto">
      {tab === "catalog" && <CatalogTab onOrderClick={(p) => setOrderProduct(p)} />}
      {tab === "promotions" && <PromotionsTab />}
      {tab === "orders" && <OrdersTab />}
      {tab === "support" && <SupportTab />}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}