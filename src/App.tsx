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
import TermsScreen from "./components/TermsScreen"; // Импортируем экран соглашения
import { getUserId } from "./lib/telegram";

const MY_TELEGRAM_ID = 8488032513; // <--- ВСТАВЬ СЮДА СВОЙ ID

export default function App() {
  const [tab, setTab] = useState<TabKey>("catalog");
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Проверяем, согласился ли уже пользователь с условиями
  const [isAgreed, setIsAgreed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const { loadProducts, loadOrders, subscribeRealtime, initProfile } = useStore();

  useEffect(() => {
    // Если в памяти телефона есть запись, что он согласился - пускаем сразу
    if (localStorage.getItem("bombs_terms_accepted") === "true") {
      setIsAgreed(true);
    }
    setIsChecking(false);

    initProfile();
    loadProducts();
    loadOrders();
    const unsub = subscribeRealtime();
    return unsub;
  }, [loadProducts, loadOrders, subscribeRealtime, initProfile]);

  const isAdmin = getUserId() === MY_TELEGRAM_ID || window.location.search.includes("admin");

  // Пока проверяем память телефона - показываем пустой экран (чтобы не было мигания)
  if (isChecking) return <div className="min-h-screen bg-[#0A0F08]"></div>;

  // Если не согласился и это не админ (чтобы ты мог тестировать) - показываем соглашение
  if (!isAgreed && !isAdmin) {
    return <TermsScreen onAccept={() => setIsAgreed(true)} />;
  }

  if (isCartOpen) {
    return <OrderScreen onClose={() => setIsCartOpen(false)} />;
  }

  return (
    <div className="min-h-full pb-28 max-w-md mx-auto relative text-white bg-[#0A0F08]">
      
      {/* 2D ФОН */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[8%] left-[10%] w-[45px] h-[45px] bg-[#E8FF3A] rounded-full shadow-[0_0_40px_#E8FF3A] opacity-80"></div>
        
        <svg className="absolute bottom-0 w-full h-[40%]" viewBox="0 0 100 50" preserveAspectRatio="none">
          <polygon points="-10,50 35,5 75,50" fill="#1A2414" />
          <polygon points="25,50 75,20 110,50" fill="#131A10" />
        </svg>

        <div className="absolute bottom-0 right-[15%] w-[4px] h-[30%] bg-[#2A3624]">
          <div className="absolute -top-[10px] -left-[8px] w-[20px] h-[20px] bg-[#E8FF3A] rounded-full shadow-[0_0_30px_10px_rgba(232,255,58,0.6)]"></div>
        </div>
      </div>

      {/* Снег и Гирлянда */}
      <div className="snow-container z-10"></div>
      <div className="garland z-20">
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`bulb ${i % 3 === 0 ? 'red' : i % 3 === 1 ? 'green' : 'blue'}`} />
        ))}
      </div>

      {/* Контент */}
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
