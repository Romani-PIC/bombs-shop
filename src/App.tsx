import { useEffect, useState } from "react";
import { useStore } from "./store/useStore";
import BottomNav, { TabKey } from "./components/BottomNav";
import CatalogTab from "./components/tabs/CatalogTab";
import PromotionsTab from "./components/tabs/PromotionsTab";
import SupportTab from "./components/tabs/SupportTab";
import QuestsTab from "./components/tabs/QuestsTab";
import MenuTab from "./components/tabs/MenuTab";
import AdminTab from "./components/tabs/AdminTab";
import OrderScreen from "./components/order/OrderScreen";
import { getUserId } from "./lib/telegram";

// ВСТАВЬ СЮДА СВОЙ РЕАЛЬНЫЙ ID (узнать можно в боте @userinfobot)
const MY_TELEGRAM_ID = 8488032513; 

export default function App() {
  const [tab, setTab] = useState<TabKey>("catalog");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { loadProducts, loadOrders, subscribeRealtime, initProfile } = useStore();

  useEffect(() => {
    initProfile();
    loadProducts();
    loadOrders();
    const unsub = subscribeRealtime();
    return unsub;
  }, [loadProducts, loadOrders, subscribeRealtime, initProfile]);

  // Проверка на админа
  const isAdmin = getUserId() === MY_TELEGRAM_ID || window.location.search.includes("admin");

  if (isCartOpen) {
    return <OrderScreen onClose={() => setIsCartOpen(false)} />;
  }

  return (
    <div className="min-h-full pb-28 max-w-md mx-auto relative text-white">
      <div className="bg-scene"><div className="bg-moon"></div><div className="bg-mountain"></div><div className="bg-lamp"></div></div>
      <div className="snow-container"></div>
      <div className="garland">{[...Array(10)].map((_, i) => (<div key={i} className={`bulb ${i % 3 === 0 ? 'red' : i % 3 === 1 ? 'green' : 'blue'}`} />))}</div>

      <div className="pt-8 relative z-20">
        {tab === "catalog" && <CatalogTab onOrderClick={() => setIsCartOpen(true)} />}
        {tab === "promotions" && <PromotionsTab />}
        {tab === "quests" && <QuestsTab />}
        {tab === "support" && <SupportTab />}
        {tab === "menu" && <MenuTab />}
        {tab === "admin" && isAdmin && <AdminTab />}
      </div>

      <BottomNav active={tab} onChange={setTab} isAdmin={isAdmin} />
    </div>
  );
}