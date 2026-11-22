export const tg = (window as any).Telegram?.WebApp;
export function initTelegram() {
  if (!tg) return;
  tg.ready(); tg.expand(); tg.setHeaderColor("#0E0E12"); tg.setBackgroundColor("#0E0E12");
}
export function getUserId(): number {
  return tg?.initDataUnsafe?.user?.id ?? 0;
}
