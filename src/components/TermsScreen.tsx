import { useState } from "react";

export default function TermsScreen({ onAccept }: { onAccept: () => void }) {
  const [checked, setChecked] = useState(false);

  const handleAccept = () => {
    if (checked) {
      localStorage.setItem("bombs_terms_accepted", "true");
      onAccept();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F08] text-white flex flex-col max-w-md mx-auto relative z-50">
      
      {/* Заголовок */}
      <div className="p-4 border-b border-[#E8FF3A]/20 sticky top-0 bg-[#0A0F08] z-10">
        <h1 className="text-xl font-bold text-center text-[#E8FF3A]">Пользовательское соглашение</h1>
        <p className="text-xs text-center text-gray-400 mt-1">Пожалуйста, ознакомьтесь перед использованием</p>
      </div>

      {/* Текст соглашения (скроллится) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm text-gray-300 leading-relaxed pb-24">
        <p><b className="text-white">1. Статус проекта:</b> Telegram-бот <a href="https://t.me/Bombs_ShopBot" className="text-[#E8FF3A] underline">@Bombs_ShopBot</a> и его мини-приложение НЕ являются торговой площадкой, маркетплейсом или коммерческим магазином.</p>
        
        <p><b className="text-white">2. Тестирование знакомыми:</b> Все пользователи, заходившие в бота до сегодняшнего дня, являются моими личными знакомыми. Они участвовали в закрытом тестировании функционала приложения.</p>
        
        <p><b className="text-white">3. Отсутствие реальных продаж:</b> Я не продавал и не продаю петарды. Все оформленные заказы (как принятые, так и отклоненные) создавались исключительно в целях демонстрации работоспособности приложения перед знакомыми.</p>
        
        <p><b className="text-white">4. Образовательные цели:</b> Проект создан исключительно в учебных целях. Я учусь разрабатывать Telegram-приложения, а также изучаю механику развития и ведения Telegram-каналов. Мой канал: <a href="https://t.me/BombsShop_SaratoV" className="text-[#E8FF3A] underline">https://t.me/BombsShop_SaratoV</a> — все посты в нем созданы в развивающих и образовательных целях.</p>
        
        <p><b className="text-white">5. Знак «*»:</b> Под всеми постами с текстом «Оформить заказ» стоит знак «*», который ведет на этот текст. Он создан для того, чтобы каждый новый пользователь понимал: бот — тестовый и не рабочий, никакие реальные петарды не доставляются, и никто никому их не обязан.</p>
        
        <p><b className="text-white">6. Реклама:</b> Я могу закупать рекламу для привлечения новых пользователей. Однако каждый пользователь перед открытием мини-приложения обязан прочитать данный пост и осознавать, что проект является тестовым.</p>
        
        <p><b className="text-white">7. Отказ от ответственности:</b> Никакая реальная деятельность, связанная с торговлей пиротехникой, не ведется. Всё взаимодействие в боте и канале носит исключительно технический и учебный характер.</p>
      </div>

      {/* Блок с кнопкой (закреплен внизу) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0A0F08] border-t border-[#E8FF3A]/20 p-4 pb-6 z-20">
        <label className="flex items-center gap-3 mb-4 cursor-pointer">
          <input 
            type="checkbox" 
            checked={checked} 
            onChange={(e) => setChecked(e.target.checked)}
            className="w-5 h-5 accent-[#E8FF3A] rounded cursor-pointer"
          />
          <span className="text-sm text-gray-200">Я прочитал(а) и согласен(на) с условиями</span>
        </label>
        
        <button 
          onClick={handleAccept} 
          disabled={!checked}
          className="w-full bg-[#E8FF3A] text-[#0A0F08] font-extrabold text-lg py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-[0_0_15px_rgba(232,255,58,0.3)]"
        >
          Войти в магазин
        </button>
      </div>
    </div>
  );
}