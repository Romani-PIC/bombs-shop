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

const RELEASE_DATE = new Date("2026-12-01T00:00:00+03:00"); 
const MY_TELEGRAM_ID = 123456789; // ВСТАВЬ СЮДА СВОЙ ID ИЗ @userinfobot !!!

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

  const isAdmin = getUserId() === MY_TELEGRAM_ID;
  const isReleased = new Date() >= RELEASE_DATE;

  // Заглушка для клиентов до 1 декабря
  if (!isReleased && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative">
        <div className="bg-scene">
          <div className="bg-moon"></div>
          <div className="bg-mountain"></div>
          <div className="bg-lamp"></div>
        </div>
        <div className="snow-container"></div>
        <div className="garland">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`bulb ${i % 3 === 0 ? 'red' : i % 3 === 1 ? 'green' : 'blue'}`} />
          ))}
        </div>
        <h1 className="text-3xl font-extrabold gradient-text mb-4 z-10">Скоро открытие!</h1>
        <p className="text-gray-300 z-10 mb-8">Мы готовим для вас много нового.<br/>Ждите 1 декабря!</p>
        <a href="https://t.me/BombsShop_SaratoV" className="btn-accent px-8 py-3 z-10">Наш Telegram-канал</a>
      </div>
    );
  }

  // Плашка для админа в режиме разработки
  const AdminBanner = isAdmin && !isReleased ? (
    <div className="bg-red-500 text-white text-[10px] text-center py-1 font-bold sticky top-0 z-50">
      Режим разработчика (Релиз: 01.12.26)
    </div>
  ) : null;

  // Экран корзины
  if (isCartOpen) {
    return (
      <>
        {AdminBanner}
        <OrderScreen onClose={() => setIsCartOpen(false)} />
      </>
    );
  }

  // Основной экран приложения
  return (
    <div className="min-h-full pb-28 max-w-md mx-auto relative text-white">
      <div className="bg-scene">
        <div className="bg-moon"></div>
        <div className="bg-mountain"></div>
        <div className="bg-lamp"></div>
      </div>
      <div className="snow-container"></div>
      <div className="garland">
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`bulb ${i % 3 === 0 ? 'red' : i % 3 === 1 ? 'green' : 'blue'}`} />
        ))}
      </div>

      {AdminBanner}

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