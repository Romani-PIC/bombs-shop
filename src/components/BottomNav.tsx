export type TabKey = "promotions" | "orders" | "catalog" | "support";

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: "promotions", label: "Акции", icon: "🏷" },
  { key: "orders", label: "Заказы", icon: "📦" },
  { key: "catalog", label: "Каталог", icon: "🎆" },
  { key: "support", label: "Поддержка", icon: "💬" },
];

export default function BottomNav({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void; }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto" style={{ background: "rgba(26,26,32,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,107,53,0.15)", paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex items-end justify-around px-2 pt-2 pb-2 relative">
        {tabs.map((t) => {
          const isCenter = t.key === "catalog";
          const isActive = active === t.key;
          if (isCenter) {
            return (
              <button key={t.key} onClick={() => onChange(t.key)} className="nav-center flex flex-col items-center justify-center -mt-8 w-16 h-16 rounded-full" style={{ background: "linear-gradient(135deg,#FF6B35,#FF2E63)", boxShadow: "0 0 22px rgba(255,46,99,0.6)" }}>
                <span className="text-2xl">{t.icon}</span>
                <span className="text-[10px] font-bold text-white mt-0.5">{t.label}</span>
              </button>
            );
          }
          return (
            <button key={t.key} onClick={() => onChange(t.key)} className="flex flex-col items-center justify-center flex-1 py-2">
              <span className="text-xl" style={{ filter: isActive ? "drop-shadow(0 0 6px rgba(255,107,53,0.8))" : "none", opacity: isActive ? 1 : 0.5 }}>{t.icon}</span>
              <span className="text-[10px] font-semibold mt-0.5" style={{ color: isActive ? "#FF6B35" : "#6B6B75" }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}