import { isAfter } from "date-fns";

export default function PromotionsTab() {
  const preorderActive = !isAfter(new Date(), new Date("2026-12-01T23:59:59"));
  const isPromoActive = new Date() >= new Date("2026-12-01T00:00:00+03:00");

  return (
    <div className="p-4 pt-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Акции</h1>
      
      <div className="space-y-3">
        <div className="card p-4 fade-in">
          <h3 className="font-extrabold text-lg text-white">Скидка 5%</h3>
          <p className="text-sm text-gray-400 mt-1">При заказе от 250 ₽</p>
        </div>
        <div className="card p-4 fade-in">
          <h3 className="font-extrabold text-lg text-white">Бесплатная доставка</h3>
          <p className="text-sm text-gray-400 mt-1">При заказе от 2200 ₽</p>
        </div>
        
        <div className="text-xs text-gray-500 text-center py-2">Скидки суммируются</div>

        {/* АКЦИЯ НЕДЕЛИ (КРАСНАЯ ОБВОДКА) */}
        <div className="relative p-1 rounded-2xl bg-[#FF4D4D] shadow-[0_0_15px_rgba(255,77,77,0.4)]">
          <div className="bg-[#131A10] p-5 rounded-xl text-center">
            <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Акция недели</div>
            <h3 className="font-extrabold text-xl text-white mb-2">Пригласи 8 друзей</h3>
            <p className="text-sm text-gray-300 mb-4">Получи <b className="text-white">100 🧨</b> на баланс</p>
            <div className="text-xs text-gray-400 mb-4">1 🧨 = 1 ₽</div>
            
            {isPromoActive ? (
              <button className="btn-accent w-full py-2 text-sm mb-3">Перейти к заданиям</button>
            ) : (
              <div className="bg-gray-800 text-gray-400 w-full py-2 rounded-lg text-sm mb-3 font-bold border border-gray-700">
                Старт 1 декабря!
              </div>
            )}
            
            <div className="text-[10px] text-gray-500">Проводится с 01.12.26 по 08.12.26</div>
          </div>
        </div>

        <div className="text-xs text-gray-400 text-center mt-4">
          Подробнее о акциях узнайте в нашем ТГК: <br/>
          <a href="https://t.me/BombsShop_SaratoV" target="_blank" rel="noreferrer" className="text-[#E8FF3A] underline">t.me/BombsShop_SaratoV</a>
        </div>
      </div>
    </div>
  );
}