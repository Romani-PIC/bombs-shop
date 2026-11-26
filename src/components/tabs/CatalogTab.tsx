import { useStore } from "../../store/useStore";

export default function CatalogTab({ onOrderClick }: { onOrderClick: () => void; }) {
  const { products, loadingProducts, addToCart, cart } = useStore();
  
  // Считаем общее количество товаров в корзине, чтобы показать на кнопке
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="p-4 pt-8 pb-24 relative">
      <h1 className="text-2xl font-bold mb-4 text-white">Каталог</h1>
      
      {loadingProducts && <div className="text-center py-10 text-gray-400">Загрузка...</div>}
      
      <div className="space-y-3">
        {products.map((p) => {
          const out = p.stock <= 0;
          return (
            <div key={p.id} className="card p-4 fade-in">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-extrabold text-lg leading-tight text-white">{p.name}</h3>
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
              
              <button 
                disabled={out} 
                onClick={() => addToCart(p, 1)} 
                className="btn-accent w-full flex items-center justify-center gap-2"
              >
                Добавить в корзину 🛒 
              </button>
            </div>
          );
        })}
      </div>

      {/* Плавающая кнопка перехода в корзину (появляется, если есть товары) */}
      {totalItems > 0 && (
        <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-4 z-40">
          <button 
            onClick={onOrderClick} 
            className="w-full bg-[#E8FF3A] text-[#0A0F08] font-extrabold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(232,255,58,0.5)] flex justify-between px-6 items-center"
          >
            <span>Перейти в корзину</span>
            <span className="bg-[#0A0F08] text-[#E8FF3A] px-3 py-1 rounded-full text-sm">{totalItems}</span>
          </button>
        </div>
      )}
    </div>
  );
}