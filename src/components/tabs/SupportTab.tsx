import { tg } from "../../lib/telegram";

export default function SupportTab() {
  const openTg = () => {
    const url = "https://t.me/BombsShopMenager";
    if (tg?.openTelegramLink) tg.openTelegramLink(url);
    else window.open(url, "_blank");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Поддержка</h1>
      <div className="card p-6 fade-in text-center">
        <div className="text-4xl mb-3">💬</div>
        <p className="text-base text-gray-200 leading-relaxed">
          Чтобы обратиться в поддержку, напишите менеджеру <span className="font-extrabold gradient-text">@BombsShopMenager</span> — он ответит на все вопросы.
        </p>
        <button onClick={openTg} className="btn-accent mt-5 w-full">Написать менеджеру</button>
      </div>
    </div>
  );
}