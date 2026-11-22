import { useMemo, useState } from "react";
import { Product } from "../../types";
import { getSaturdays, TIME_SLOTS } from "../../utils/dates";
import { calcDiscount, calcTotal, isFreeDelivery } from "../../utils/pricing";
import { useStore } from "../../store/useStore";
import Modal from "../Modal";
import Toast from "../Toast";

export default function OrderScreen({ product, onClose }: { product: Product; onClose: () => void; }) {
  const { placeOrder } = useStore();
  const [qty, setQty] = useState(1);
  const [address, setAddress] = useState("");
  const [dateIdx, setDateIdx] = useState(0);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [showPay, setShowPay] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [toast, setToast] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const saturdays = useMemo(() => getSaturdays(), []);
  const subtotal = qty * product.price_per_pack;
  const preorderActive = new Date() < new Date("2026-12-01T23:59:59");
  const discount = calcDiscount(subtotal, preorderActive);
  const total = calcTotal(subtotal, discount);
  const delivery = isFreeDelivery(subtotal);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };
  const increment = () => { if (qty < product.stock) setQty(qty + 1); else showToast(`Максимум ${product.stock} пачек`); };
  const decrement = () => { if (qty > 1) setQty(qty - 1); };

  const onPayClick = () => {
    if (!address.trim()) return showToast("Укажите адрес");
    if (saturdays.length === 0) return showToast("Нет доступных дат");
    setShowPay(true);
  };

  const confirmOrder = async () => {
    setShowPay(false);
    if (submitting) return;
    setSubmitting(true);
    try {
      await placeOrder({ product, qty, subtotal, discount, total, address: address.trim(), meeting_date: saturdays[dateIdx].iso, time_slot: timeSlot, delivery_free: delivery !== "paid" });
      setShowSuccess(true);
    } catch (e: any) {
      showToast(e.message || "Ошибка оформления");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full pb-10 max-w-md mx-auto fade-in relative">
      <div className="relative" style={{ height: "45vh" }}>
        <button onClick={onClose} className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(14,14,18,0.9)", border: "1.5px solid rgba(255,107,53,0.4)", color: "#FF6B35", fontSize: 20 }}>←</button>
        <iframe title="Карта доставки" src="https://yandex.ru/maps/194/saratov/?ll=46.057544%2C51.571700&mode=usermaps&source=constructorLink&um=constructor%3Ae49ef3d99ed8a63435041d68fe72b499bb80f9cf07283bc73613c73188928dda&z=11.92" className="w-full h-full border-0" />
      </div>

      <div className="p-4 space-y-4">
        <div className="card p-4">
          <h2 className="font-extrabold text-xl">{product.name}</h2>
          <div className="text-sm text-gray-400 mt-1">Пачка {product.items_per_pack} шт · {product.price_per_pack} ₽</div>
        </div>

        <div className="card p-4 flex items-center justify-between">
          <span className="font-bold">Количество:</span>
          <div className="flex items-center gap-3">
            <button onClick={decrement} className="w-8 h-8 rounded-full bg-[#23232B] text-[#FF6B35] font-bold text-xl flex items-center justify-center">−</button>
            <span className="font-bold text-lg w-6 text-center">{qty}</span>
            <button onClick={increment} className="w-8 h-8 rounded-full bg-[#23232B] text-[#FF6B35] font-bold text-xl flex items-center justify-center">+</button>
          </div>
        </div>

        <div className="card p-4 space-y-3">
          <div className="text-sm text-gray-300">
            <div>Сумма: <span className="font-bold text-white">{subtotal} ₽</span></div>
            {discount > 0 && <div className="text-green-400">Скидка: -{discount} ₽</div>}
20:49
<div className="text-xs text-gray-400 mt-1">Доставка: {delivery === "paid" ? "по тарифам карты" : "бесплатно"}</div>
          </div>
          <div className="border-t border-white/10 pt-2">
            <span className="text-gray-300">К оплате (с учётом +2%): </span>
            <span className="font-extrabold gradient-text text-xl">{total} ₽</span>
          </div>
        </div>

        <input type="text" placeholder="Введите адрес доставки" value={address} onChange={(e) => setAddress(e.target.value)} className="input" />

        <div className="card p-4 space-y-3">
          <div className="font-bold text-sm">Дата встречи (только субботы):</div>
          <select value={dateIdx} onChange={(e) => setDateIdx(Number(e.target.value))} className="input">
            {saturdays.map((s, i) => <option key={s.iso} value={i}>{s.label}</option>)}
          </select>
          <div className="font-bold text-sm mt-2">Время:</div>
          <div className="flex gap-2">
            {TIME_SLOTS.map((t) => (
              <button key={t} onClick={() => setTimeSlot(t)} className={`flex-1 py-2 rounded-lg font-bold border ${timeSlot === t ? "border-[#FF6B35] text-[#FF6B35] bg-[#FF6B35]/10" : "border-gray-600 text-gray-400"}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-400 text-center">Доставка осуществляется только по субботам.</div>

        <button onClick={onPayClick} disabled={submitting} className="btn-accent w-full text-lg py-4">
          {submitting ? "Отправка..." : "Оплатить при получении +2%"}
        </button>
      </div>

      <Modal open={showPay} onClose={() => setShowPay(false)}>
        <h3 className="font-extrabold text-lg mb-3">Оплата при получении</h3>
        <p className="text-sm text-gray-300 leading-relaxed mb-5">
          Возьмите всю сумму с учётом 2% (сумма товара + 2%). Стоимость доставки менеджер скинет в чат покупателя в течение дня. <b>Сдачи курьер не выдаёт.</b>
        </p>
        <button onClick={confirmOrder} className="btn-accent w-full">Хорошо!</button>
      </Modal>

      <Modal open={showSuccess} onClose={() => { setShowSuccess(false); onClose(); }}>
        <h3 className="font-extrabold text-lg mb-3 gradient-text">Заказ оформлен!</h3>
        <p className="text-sm text-gray-300 leading-relaxed mb-5">
          Встреча: <b>{saturdays[dateIdx]?.label}</b> в <b>{timeSlot}</b>.<br/><br/>В течение дня менеджер проверит заказ и напишет полную сумму в чат.
        </p>
        <button onClick={() => { setShowSuccess(false); onClose(); }} className="btn-accent w-full">Отлично</button>
      </Modal>

      <Toast msg={toast} visible={!!toast} />
    </div>
  );
}