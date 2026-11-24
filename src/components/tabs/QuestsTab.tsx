import { useState } from "react";
import { useStore } from "../../store/useStore";

export default function QuestsTab() {
  const { profile, claimQuestSubscribe, claimQuest25 } = useStore();
  const [toast, setToast] = useState("");
  
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const friendsCount = 0; // В будущем сделаем точный подсчет приглашенных
  const botLink = `https://t.me/Bombs_ShopBot/BombsShop?startapp=ref_${profile?.telegram_id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(botLink);
    showToast("Ссылка скопирована!");
  };

  return (
    <div className="p-4 pt-8">
      <h1 className="text-2xl font-bold mb-4 gradient-text">Задания</h1>
      
      <div className="space-y-3">
        {/* 1. Подписка на канал */}
        <div className={`card p-4 ${profile?.is_subscribed ? 'opacity-50 grayscale' : ''}`}>
          <h3 className="font-bold text-lg text-white">Подпишись на канал</h3>
          <p className="text-sm text-gray-400 mb-3">Получи 10 🧨 за подписку</p>
          {!profile?.is_subscribed ? (
            <button onClick={claimQuestSubscribe} className="btn-accent w-full py-2 text-sm">Выполнить</button>
          ) : (
            <div className="text-green-400 text-sm font-bold">Выполнено</div>
          )}
        </div>

        {/* 2. Приглашение друзей */}
        <div className="card p-4 border-[#E8FF3A]/50">
          <h3 className="font-bold text-lg text-white">Приглашай друзей</h3>
          <p className="text-sm text-gray-400 mb-3">Получай 5 🧨 за каждого друга</p>
          <button onClick={copyLink} className="btn-accent w-full py-2 text-sm">Скопировать ссылку</button>
        </div>

        {/* 3. Квест недели */}
        <div className="card p-4 bg-gradient-to-br from-[#131A10] to-[#1B2417] border-[#A6E22E]">
          <h3 className="font-bold text-lg text-white">Пригласи 25 друзей</h3>
          <p className="text-sm text-gray-400 mb-2">Награда: 500 🧨</p>
          <div className="w-full bg-gray-700 h-2 rounded-full mb-3">
            <div className="bg-green-400 h-2 rounded-full" style={{ width: `${(friendsCount / 25) * 100}%` }}></div>
          </div>
          {friendsCount >= 25 && !profile?.quest_25_claimed ? (
            <button onClick={claimQuest25} className="btn-accent w-full py-2 text-sm bg-green-500">Забрать 500 🧨</button>
          ) : (
             <div className="text-xs text-gray-500">Прогресс: {friendsCount} / 25</div>
          )}
        </div>

        {/* Подсказка про баги */}
        <div className="text-[11px] text-gray-400 bg-[#1A1A20] p-3 rounded-xl border border-gray-700/50 mt-4">
          Нашли баг? Или не получили вознаграждение?<br/>
          Напишите нам в <a href="https://t.me/BombsShopMenager" target="_blank" rel="noreferrer" className="text-[#E8FF3A] underline">поддержку</a>.
        </div>
      </div>

      {toast && <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-black px-4 py-2 rounded-lg font-bold z-50">{toast}</div>}
    </div>
  );
}