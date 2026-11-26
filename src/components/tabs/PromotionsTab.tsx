import { isAfter } from "date-fns";

export default function PromotionsTab() {
  const preorderActive = !isAfter(new Date(), new Date("2026-12-01T23:59:59"));
  const promos = [
    { id: 1, title: "Скидка 5%", desc: "При заказе от 250 ₽", active: true },
    { id: 2, title: "Скидка 5%", desc: "На предзаказ до 01.12.2026", active: preorderActive },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Акции</h1>
      <div className="space-y-3">
        {promos.map((p) => (
          <div key={p.id} className="card p-4 fade-in" style={{ opacity: p.active ? 1 : 0.45 }}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-lg">{p.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{p.desc}</p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: p.active ? "rgba(166,226,46,0.15)" : "rgba(120,120,120,0.2)", color: p.active ? "#A6E22E" : "#888" }}>
                {p.active ? "Активна" : "Истекла"}
              </span>
            </div>
          </div>
        ))}
        <div className="card p-4 text-sm text-gray-400">Скидки суммируются. 2% за оплату при получении рассчитываются после применения скидок.</div>
      </div>
    </div>
  );
}