import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Order } from "../../types";
import { tg } from "../../lib/telegram"; // Импортируем Telegram API

export default function AdminTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAllOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data ?? []); 
    setLoading(false);
  };

  useEffect(() => { loadAllOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) {
      alert("Ошибка при обновлении: " + error.message);
    } else {
      loadAllOrders();
    }
  };

  const copyUserId = (id: number) => {
    navigator.clipboard.writeText(String(id));
    alert("ID клиента скопирован!");
  };

  // Функция для перехода в чат с клиентом
  const openChat = (id: number) => {
    const url = `tg://user?id=${id}`;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(url); // Открываем через встроенный API Telegram
    } else {
      window.open(url, "_blank"); // Резервный вариант для браузера
    }
  };

  return (
    <div className="p-4 pt-8">
      <h1 className="text-2xl font-bold mb-4 text-white">👑 Админ-панель</h1>
      {loading && <div className="text-gray-400">Загрузка...</div>}
      
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="card p-4 text-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-bold text-white mb-1">Заказ от {new Date(o.created_at).toLocaleDateString()}</div>
                
                {/* БЛОК С ID И КНОПКАМИ СВЯЗИ */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <div className="text-gray-400 text-xs">ID: {o.user_id}</div>
                  
                  <button 
                    onClick={() => copyUserId(o.user_id)} 
                    className="text-[10px] bg-gray-700 text-white px-2 py-1 rounded active:scale-95 transition-transform"
                  >
                    Копировать
                  </button>
                  
                  <button 
                    onClick={() => openChat(o.user_id)} 
                    className="text-[10px] bg-[#E8FF3A] text-[#0A0F08] font-bold px-3 py-1 rounded active:scale-95 transition-transform shadow-[0_0_10px_rgba(232,255,58,0.4)]"
                  >
                    💬 Написать в чат
                  </button>
                </div>

                <div className="text-gray-400 text-xs">{o.address}</div>
                <div className="text-gray-400 text-xs">Встреча: {o.meeting_date}, {o.time_slot}</div>
                <div className="text-gray-400 text-xs mt-1">
                  Товары: {o.items && o.items.length > 0 
                    ? o.items.map((i: any) => `${i.product.name} (x${i.qty})`).join(", ") 
                    : "Старый заказ"}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#E8FF3A]">{o.total} ₽</div>
                <div className={`text-xs mt-1 font-bold ${o.status === 'pending' ? 'text-yellow-400' : o.status === 'accepted' ? 'text-green-400' : 'text-red-400'}`}>
                  {o.status === 'pending' ? 'ОЖИДАЕТ' : o.status === 'accepted' ? 'ПРИНЯТ' : 'ОТКЛОНЕН'}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-3">
              {o.status === "pending" && (
                <>
                  <button onClick={() => updateStatus(o.id, "accepted")} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-bold transition-colors">Принять</button>
                  <button onClick={() => updateStatus(o.id, "rejected")} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-bold transition-colors">Отклонить</button>
                </>
              )}
              {(o.status === "accepted" || o.status === "rejected") && (
                <button onClick={() => updateStatus(o.id, "archived")} className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg font-bold transition-colors">Завершить (в архив)</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}