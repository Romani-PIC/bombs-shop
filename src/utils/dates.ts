import { addDays, format, nextSaturday, isAfter, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";

const LAST_DATE = new Date("2027-03-06T23:59:59");

export interface SaturdayOption {
  date: Date;
  label: string;
  iso: string;
}

export function getSaturdays(): SaturdayOption[] {
  const result: SaturdayOption[] = [];
  let cur = nextSaturday(new Date());
  if (isAfter(cur, LAST_DATE)) return result;

  while (!isAfter(startOfDay(cur), startOfDay(LAST_DATE))) {
    result.push({
      date: cur,
      label: format(cur, "d MMMM yyyy (EEEE)", { locale: ru }),
      iso: format(cur, "yyyy-MM-dd"),
    });
    cur = addDays(cur, 7);
  }
  return result;
}

export const TIME_SLOTS = ["14:00–16:00", "16:00–18:00"];