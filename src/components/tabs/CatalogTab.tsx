import { useStore } from "../../store/useStore";
import { Product } from "../../types";

export default function CatalogTab({ onOrderClick }: { onOrderClick: (p: Product) => void; }) {
  const { products, loadingProducts } = useStore();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 gradient-text">Каталог</h1>
      {loadingProducts && <div className="text-center py-10 text-gray-400">Загрузка...</div>}
      <div className="space-y-3">
        {products.map((p) => {
          const out = p.stock <= 0;
          return (
            <div key={p.id} className="card p-4 fade-in">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-extrabold text-lg leading-tight">{p.name}</h3>
                  <div className="text-sm text-gray-400 mt-1">Пачка {p.items_per_pack} шт</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-lg gradient-text">{p.price_per_pack} ₽</div>
                </div>
              </div>
              <div className="mb-3">
                <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: out ? "rgba(255,77,77,0.15)" : p.stock <= 3 ? "rgba(255,214,10,0.15)" : "rgba(166,226,46,0.15)", color: out ? "#FF4D4D" : p.stock <= 3 ? "#FFD60A" : "#A6E22E" }}>
                  {out ? "Нет в наличии" : `Осталось ${p.stock} пачек`}
                </span>
              </div>
              <button disabled={out} onClick={() => onOrderClick(p)} className="btn-accent w-full">Заказать</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}