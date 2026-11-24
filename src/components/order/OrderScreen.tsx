import { useMemo, useState } from "react";
import { getSaturdays, TIME_SLOTS } from "../../utils/dates";
import { calcDiscount, calcTotal, getDeliveryCost } from "../../utils/pricing";
import { useStore } from "../../store/useStore";
import Modal from "../Modal";
import Toast from "../Toast";

export default function OrderScreen({ onClose }: { onClose: () => void; }) {
  const { placeOrder, cart, profile, removeFromCart, addToCart } = useStore();
  
  const [address, setAddress] = useState("");
  const [dateIdx, setDateIdx] = useState(0);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [showPay, setShowPay] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [toast, setToast] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Переключатели для петард
  const [usePetardsForOrder, setUsePetardsForOrder] = useState(false);
  const [usePetardsForDelivery, setUsePetardsForDelivery] = useState(false);

  const saturdays = useMemo(() => getSaturdays(), []);

  // Подсчет сумм
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price_per_pack * item.qty), 0);
  const preorderActive = new Date() < new Date("2026-12-01T23:59:59");
  const baseDiscount = calcDiscount(subtotal, preorderActive);
  
  const deliveryInfo = getDeliveryCost(subtotal, address);
  const baseDeliveryCost = deliveryInfo.cost;
  const petardsBalance = profile?.petards || 0;
  
  // 1. Скидка петардами на товары (максимум 8% от суммы товаров)
  const maxOrderPetards = Math.min(petardsBalance, Math.floor(subtotal * 0.08));
  const orderPetardDiscount = usePetardsForOrder ? maxOrderPetards : 0;

  // 2. Скидка петардами на доставку (только если выбрано ТЦ)
  const isPickupPoint = deliveryInfo.type.includes("Встреча у");
  const maxDeliveryPetards = Math.min((petardsBalance - orderPetardDiscount), baseDeliveryCost);
  const deliveryPetardDiscount = (usePetardsForDelivery && isPickupPoint) ? maxDeliveryPetards : 0;
  
  const finalDeliveryCost = baseDeliveryCost - deliveryPetardDiscount;
  const totalPetardsUsed = orderPetardDiscount + deliveryPetardDiscount;
  
  // Итоговая сумма: (Сумма - Скидки - Петарды) * 1.02 + Доставка
  const finalTotal = calcTotal(subtotal, baseDiscount + orderPetardDiscount, finalDeliveryCost);
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const onPayClick = () => {
    if (cart.length === 0) return showToast("Корзина пуста");
    if (!address.trim()) return showToast("Укажите адрес доставки или ТЦ");
    if (saturdays.length === 0) return showToast("Нет доступных дат");
    setShowPay(true);
  };

  const confirmOrder = async () => {
    setShowPay(false);
    if (submitting) return;
    setSubmitting(true);
    try {
      await placeOrder({ 
        address: address.trim(), 
        meeting_date: saturdays[dateIdx].iso, 
        time_slot: timeSlot, 
        total: finalTotal, 
        subtotal, 
        discount: baseDiscount + orderPetardDiscount, 
        delivery_cost: finalDeliveryCost, 
        petards_used: totalPetardsUsed 
      });
      setShowSuccess(true);
    } catch (e: any) {
      showToast(e.message || "Ошибка оформления");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full pb-10 max-w-md mx-auto fade-in relative z-20 pt-6">
      <div className="p-4 space-y-4">
        
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold gradient-text">Корзина</h1>
          <button onClick={onClose} className="text-gray-400 text-sm underline">Назад в каталог</button>
        </div>

        {/* СПИСОК ТОВАРОВ В КОРЗИНЕ */}
        {cart.length === 0 ? (
          <div className="text-center py-10 text-gray-400">Ваша корзина пуста</div>
        ) : (
          <div className="space-y-2">
            {cart.map((item) => (



<div key={item.product.id} className="card p-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white text-sm">{item.product.name}</div>
                  <div className="text-xs text-gray-400">{item.product.price_per_pack} ₽ × {item.qty}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 font-bold text-xl px-2">−</button>
                  <span className="font-bold">{item.qty}</span>
                  <button onClick={() => addToCart(item.product, 1)} className="text-green-400 font-bold text-xl px-2">+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* БЛОК С АДРЕСОМ И ИТОГАМИ */}
        <div className="card p-4 space-y-2">
          <input 
            type="text" 
            placeholder="Адрес доставки или название ТЦ" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            className="input mb-2" 
          />
          
          <div className="flex justify-between text-sm text-gray-300">
            <span>Товары:</span>
            <span>{subtotal} ₽</span>
          </div>
          <div className="flex justify-between text-sm text-green-400">
            <span>Скидка (акции):</span>
            <span>-{baseDiscount} ₽</span>
          </div>
          <div className="flex justify-between text-sm text-gray-300">
            <span>Доставка ({deliveryInfo.type}):</span>
            <span>{finalDeliveryCost === 0 ? "Бесплатно" : `${finalDeliveryCost} ₽`}</span>
          </div>

          {/* СПИСАНИЕ ПЕТАРД НА ТОВАРЫ */}
          {petardsBalance > 0 && (
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-[#E8FF3A]">Списать 🧨  на товары (макс 8%)</span>
                <input type="checkbox" checked={usePetardsForOrder} onChange={() => setUsePetardsForOrder(!usePetardsForOrder)} className="w-4 h-4 accent-[#E8FF3A]" />
              </div>
              {usePetardsForOrder && <div className="text-xs text-green-400 text-right">-{orderPetardDiscount} ₽</div>}
            </div>
          )}

          {/* СПИСАНИЕ ПЕТАРД НА ДОСТАВКУ (ТОЛЬКО ДЛЯ ТЦ) */}
          {petardsBalance > 0 && isPickupPoint && (
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-[#E8FF3A]">Списать 🧨  на доставку</span>
              <input type="checkbox" checked={usePetardsForDelivery} onChange={() => setUsePetardsForDelivery(!usePetardsForDelivery)} className="w-4 h-4 accent-[#E8FF3A]" />
            </div>
          )}
          {usePetardsForDelivery && <div className="text-xs text-green-400 text-right">-{deliveryPetardDiscount} ₽</div>}

          <div className="border-t border-white/10 pt-2 mt-2 flex justify-between items-center">
            <span className="text-white font-bold">Итого (+2%):</span>
            <span className="font-extrabold gradient-text text-xl">{finalTotal} ₽</span>
          </div>
        </div>

        {/* ВЫБОР ДАТЫ */}
        <div className="card p-4 space-y-3">
          <div className="font-bold text-sm text-white">Дата встречи (субботы):</div>
          <select value={dateIdx} onChange={(e) => setDateIdx(Number(e.target.value))} className="input">
            {saturdays.map((s, i) => <option key={s.iso} value={i}>{s.label}</option>)}
          </select>
          
          <div className="flex gap-2">
            {TIME_SLOTS.map((t) => (
              <button key={t} onClick={() => setTimeSlot(t)} className={`flex-1 py-2 rounded-lg font-bold border ${timeSlot === t ? "border-[#E8FF3A] text-[#E8FF3A] bg-[#E8FF3A]/10" : "border-gray-600 text-gray-400"}`}>{t}</button>
            ))}
          </div>
        </div>

<button onClick={onPayClick} disabled={submitting || cart.length === 0} className="btn-accent w-full text-lg py-4 mt-2">
          {submitting ? "Отправка..." : `Оплатить при получении +2% (${finalTotal} ₽)`}
        </button>
      </div>

      {/* МОДАЛКА ПОДТВЕРЖДЕНИЯ */}
      <Modal open={showPay} onClose={() => setShowPay(false)}>
        <h3 className="font-extrabold text-lg mb-3 text-white">Оплата при получении</h3>
        <p className="text-sm text-gray-300 leading-relaxed mb-5">
          Возьмите точную сумму <b>{finalTotal} ₽</b> или оплатите переводом. <b>Сдачи курьер не выдаёт.</b><br/><br/>
          За день до встречи с вами свяжется менеджер и назовет точное время.
        </p>
        <button onClick={confirmOrder} className="btn-accent w-full">Хорошо!</button>
      </Modal>

      {/* МОДАЛКА УСПЕХА */}
      <Modal open={showSuccess} onClose={() => { setShowSuccess(false); onClose(); }}>
        <h3 className="font-extrabold text-lg mb-3 gradient-text">Заказ оформлен!</h3>
        <p className="text-sm text-gray-300 leading-relaxed mb-5">
          Встреча: <b>{saturdays[dateIdx]?.label}</b> в <b>{timeSlot}</b>.<br/><br/>
          В течение дня менеджер проверит заказ и напишет вам в чат.
        </p>
        <button onClick={() => { setShowSuccess(false); onClose(); }} className="btn-accent w-full">Отлично</button>
      </Modal>

      <Toast msg={toast} visible={!!toast} />
    </div>
  );
}