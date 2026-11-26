import { useStore } from "../../store/useStore";

export default function MenuTab() {
  const { profile, orders } = useStore();
  const botLink = `https://t.me/Bombs_ShopBot/BombsShop?startapp=ref_${profile?.telegram_id}`;

  // Фильтруем заказы на активные и архивные
  const activeOrders = orders.filter(o => o.status !== "archived");
  const archivedOrders = orders.filter(o => o.status === "archived");

  return (
    <div className="p-4 pt-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Меню</h1>
      
      {/* Блок баланса */}
      <div className="card p-5 text-center mb-4 bg-gradient-to-b from-[#1B2417] to-[#131A10]">
        <div className="text-gray-400 text-sm">Ваш баланс</div>
        <div className="text-4xl font-extrabold gradient-text mb-1">{profile?.petards || 0} 🧨</div>
        <div className="text-[10px] text-gray-500 leading-tight">
          1 🧨 = 1₽<br/>
          До 8% скидки на товары или до 100% на доставку до ТЦ
        </div>
      </div>

      {/* Реферальная ссылка */}
      <div className="card p-4 mb-4 border-[#E8FF3A]/50">
        <h3 className="font-bold text-white mb-2 text-sm">Ваша реф. ссылка</h3>
        <input readOnly value={botLink} className="input text-xs mb-2 text-gray-400" />
        <button onClick={() => { navigator.clipboard.writeText(botLink); alert('Скопировано!'); }} className="btn-accent w-full py-2 text-xs">Скопировать</button>
      </div>

      {/* Мои заказы */}
      <div className="mb-4">
        <h3 className="font-bold text-gray-400 mb-2 text-sm">Мои активные заказы</h3>
        {activeOrders.length === 0 ? (
          <div className="text-gray-500 text-sm">Активных заказов нет</div>
        ) : (
          activeOrders.map(o => (
            <div key={o.id} className="card p-3 mb-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>{o.meeting_date}</span>
                <span className="font-bold text-white">{o.total} ₽</span>
              </div>
              <div className="text-xs mt-1 text-[#E8FF3A]">Статус: {o.status}</div>
            </div>
          ))
        )}
      </div>

      {/* Архив заказов */}
      <div>
        <h3 className="font-bold text-gray-500 mb-2 text-sm">Архив заказов</h3>
        {archivedOrders.map(o => (
          <div key={o.id} className="card p-3 mb-2 text-sm opacity-50 grayscale">
            <div className="flex justify-between text-gray-300">
              <span>{o.meeting_date}</span>
              <span className="font-bold text-white">{o.total} ₽</span>
            </div>
            <div className="text-xs mt-1 text-gray-500">Статус: {o.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}