export type TabKey = "promotions" | "quests" | "catalog" | "support" | "menu" | "admin";

const IconPromo = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
const IconQuest = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const IconCatalog = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const IconSupport = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const IconMenu = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const IconAdmin = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>;

export default function BottomNav({ active, onChange, isAdmin }: { active: TabKey; onChange: (t: TabKey) => void; isAdmin?: boolean; }) {
  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "promotions", label: "Акции", icon: <IconPromo /> },
    { key: "quests", label: "Задания", icon: <IconQuest /> },
    { key: "catalog", label: "Каталог", icon: <IconCatalog /> },
    { key: "support", label: "Поддержка", icon: <IconSupport /> },
    { key: "menu", label: "Меню", icon: <IconMenu /> },
  ];
  
  if (isAdmin) {
    tabs.push({ key: "admin", label: "Админ", icon: <IconAdmin /> });
  }

  return (

<nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-[#0A0F08]/95 backdrop-blur-xl border-t border-[#E8FF3A]/20 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-end justify-around px-1 pt-2 pb-2 relative">
        {tabs.map((t) => {
          const isCenter = t.key === "catalog";
          const isActive = active === t.key;
          if (isCenter) {
            return (
              <button key={t.key} onClick={() => onChange(t.key)} className="flex flex-col items-center justify-center -mt-8 w-16 h-16 rounded-full bg-gradient-to-br from-[#E8FF3A] to-[#A6E22E] text-[#0A0F08] shadow-[0_0_20px_rgba(232,255,58,0.5)]">
                <span className="mb-0.5">{t.icon}</span>
                <span className="text-[9px] font-extrabold uppercase">{t.label}</span>
              </button>
            );
          }
          return (
            <button key={t.key} onClick={() => onChange(t.key)} className={`flex flex-col items-center justify-center flex-1 py-2 ${isActive ? 'text-[#E8FF3A]' : 'text-[#6B7263]'}`}>
              <span style={{ filter: isActive ? "drop-shadow(0 0 6px rgba(232,255,58,0.8))" : "none" }}>{t.icon}</span>
              <span className="text-[9px] font-semibold mt-1">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}