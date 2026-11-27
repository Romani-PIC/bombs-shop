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
    <div className="min-h-screen bg-[#0A0F08] text-white flex flex-col justify-center items-center p-6 max-w-md mx-auto relative z-50">
      
      <div className="w-full space-y-6">
        {/* Заголовок и иконка */}
        <div className="text-center">
          <div className="text-5xl mb-4">🎆</div>
          <h1 className="text-2xl font-bold text-[#E8FF3A]">Добро пожаловать!</h1>
          <p className="text-sm text-gray-400 mt-2">Перед началом использования, пожалуйста, ознакомьтесь с правилами.</p>
        </div>

        {/* Кнопка-ссылка на соглашение */}
        <a
          href="https://telegra.ph/O-proekte-11-25-3"
          target="_blank"
          rel="noreferrer"
          className="block w-full text-center bg-[#131A10] border border-[#E8FF3A]/30 text-[#E8FF3A] font-bold py-4 rounded-xl hover:bg-[#1A2414] transition-colors"
        >
          📄 Пользовательское соглашение
        </a>

        {/* Чекбокс согласия */}
        <label className="flex items-start gap-3 cursor-pointer p-4 bg-[#131A10] rounded-xl border border-gray-700/50">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="w-5 h-5 mt-0.5 accent-[#E8FF3A] rounded cursor-pointer shrink-0"
          />
          <span className="text-xs text-gray-300 leading-relaxed">
            Я прочитал(а) и полностью согласен(на) с условиями пользовательского соглашения.
          </span>
        </label>

        {/* Кнопка входа */}
        <button
          onClick={handleAccept}
          disabled={!checked}
          className="w-full bg-[#E8FF3A] text-[#0A0F08] font-extrabold text-lg py-4 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-[0_0_15px_rgba(232,255,58,0.3)] mt-4"
        >
          Войти в магазин
        </button>
      </div>

    </div>
  );
}