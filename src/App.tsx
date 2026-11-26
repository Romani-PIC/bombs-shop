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

const MY_TELEGRAM_ID = 8488032513; // <--- ВСТАВЬ СЮДА СВОЙ ID

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

  const isAdmin = getUserId() === MY_TELEGRAM_ID || window.location.search.includes("admin");

  if (isCartOpen) {
    return <OrderScreen onClose={() => setIsCartOpen(false)} />;
  }

  return (
    <div className="min-h-full pb-28 max-w-md mx-auto relative text-white bg-[#0A0F08]">
      
      {/* 2D ФОН - жестко фиксируем на заднем плане */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Луна слева */}
        <div className="absolute top-[10%] left-[10%] w-[60px] h-[60px] bg-[#E8FF3A] rounded-full shadow-[0_0_50px_#E8FF3A] opacity-90"></div>
        
        {/* Гора внизу */}
        <div className="absolute bottom-0 left-0 w-full h-[35%] bg-gradient-to-t from-[#1E2E18] to-transparent rounded-t-[50%]"></div>
        
        {/* Фонарь справа */}
        <div className="absolute bottom-0 right-[15%] w-[6px] h-[35%] bg-[#2A3624]">
          {/* Светящаяся лампа */}
          <div className="absolute -top-[15px] -left-[7px] w-[20px] h-[20px] bg-[#E8FF3A] rounded-full shadow-[0_0_30px_10px_rgba(232,255,58,0.6)]"></div>
        </div>
      </div>

      {/* Снег и Гирлянда (поверх фона) */}
      <div className="snow-container z-10"></div>
      <div className="garland z-20">
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`bulb ${i % 3 === 0 ? 'red' : i % 3 === 1 ? 'green' : 'blue'}`} />
        ))}
      </div>

      {/* Контент вкладок (самый верхний слой) */}
      <div className="pt-8 relative z-30">
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

