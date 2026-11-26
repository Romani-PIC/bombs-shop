import { useStore } from "../../store/useStore";

export default function OrdersTab() {
  const { orders } = useStore();

  return (
    <div className="p-4 pt-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Мои заказы</h1>
      {orders.length === 0 && <div className="card p-6 text-center text-gray-400">У вас пока нет заказов</div>}
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="card p-4 fade-in">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-extrabold text-base text-white">Заказ от {new Date(o.created_at).toLocaleDateString()}</h3>
              <span className="text-xs px-2 py-1 rounded bg-yellow-500/15 text-yellow-400 font-bold">
                {o.status === "pending" ? "Ожидает проверки" : o.status}
              </span>
            </div>
            <div className="text-sm text-gray-400 space-y-1">
              <div>Товары: {o.items?.map((i: any) => `${i.product.name} (x${i.qty})`).join(", ")}</div>
              <div>Встреча: {o.meeting_date}, {o.time_slot}</div>
              <div>Адрес: {o.address}</div>
              <div className="pt-2 border-t border-white/10 mt-2">
                <span className="text-gray-300">Итого: </span>
                <span className="font-extrabold gradient-text text-lg">{o.total} ₽</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}