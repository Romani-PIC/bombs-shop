export function calcDiscount(subtotal: number, hasPreorder: boolean): number {
  let discount = 0;
  if (subtotal >= 250) discount += 5;
  if (hasPreorder) discount += 5;
  return Math.round((subtotal * discount) / 100);
}

export function calcTotal(subtotal: number, discount: number, deliveryCost: number): number {
  return Math.round((subtotal - discount) * 1.02) + deliveryCost;
}

export function getDeliveryCost(subtotal: number, address: string): { cost: number; type: string } {
  if (subtotal >= 2200) return { cost: 0, type: "Бесплатно от 2200₽" };
  
  const addr = address.toLowerCase();

  // 1. ПУНКТЫ ВЫДАЧИ (ТЦ)
  if (addr.includes("бульвар мювка") || addr.includes("мювка")) return { cost: 0, type: "Самовывоз (Бульвар Мювка)" };
  if (addr.includes("хэппи") || addr.includes("happy")) return { cost: 75, type: "Встреча у Хэппи Молл" };
  if (addr.includes("тау галерея") || addr.includes("тау")) return { cost: 120, type: "Встреча у Тау Галерея" };
  if (addr.includes("триумф")) return { cost: 180, type: "Встреча у Триумф Молл" };

  // 2. ЗОНЫ ДОСТАВКИ (ключевые слова для поиска)
  
  // Оранжевая зона (320₽) 
  const orangeZone = ["рейн", "тепличный", "кокурино", "калашников", "нез", "нёз"];
  
  // Красная зона (300₽) 
  const redZone = ["соколовый", "елшанка", "московское шоссе", "гвардейская"];
  
  // Темно-зеленая зона (280₽) - Центр
  const darkGreenZone = ["ленина", "московская", "соколовая", "чернышевского", "волжская", "кирова", "чапаева"];
  
  // Фиолетовая зона (200₽) 
  const purpleZone = ["кумысная", "лысая", "лесная"];
  
  // Синяя зона (180₽) 
  const blueZone = ["рабочая", "большая садовая", "астраханская", "университетская"];
  
  // ЯРКО-ЗЕЛЕНАЯ ЗОНА (120₽) - Солнечный район (по твоим скриншотам!)
  const brightGreenZone = [
    "солнечный", "солнечная", "тарухова", "тархова", "1-я линия", "2-я линия", 
    "мичурина", "ленинская", "садовая", "полевая", "щербакова", "1-й солнечный", 
    "2-й солнечный", "3-й солнечный", "4-й солнечный", "5-й солнечный", "6-й солнечный", 
    "7-й солнечный", "мирная", "строителей", "юбилейная", "юбилейный", "перспективная", 
    "тихая", "деловая", "лунная", "счастливая", "георгиева", "коннова", "луппова", 
    "козлитина", "батавина", "зыбина", "спортивная", "топольчанская", "уфимцева"
  ];

  // Проверка зон
  if (orangeZone.some(word => addr.includes(word))) return subtotal >= 1500 ? { cost: 0, type: "Бесплатно от 1500₽" } : { cost: 320, type: "Доставка" };
  if (redZone.some(word => addr.includes(word))) return subtotal >= 1500 ? { cost: 0, type: "Бесплатно от 1500₽" } : { cost: 300, type: "Доставка" };
  if (darkGreenZone.some(word => addr.includes(word))) return subtotal >= 1500 ? { cost: 0, type: "Бесплатно от 1500₽" } : { cost: 280, type: "Доставка" };
  if (purpleZone.some(word => addr.includes(word))) return subtotal >= 1500 ? { cost: 0, type: "Бесплатно от 1500₽" } : { cost: 200, type: "Доставка" };
  if (blueZone.some(word => addr.includes(word))) return subtotal >= 1500 ? { cost: 0, type: "Бесплатно от 1500₽" } : { cost: 180, type: "Доставка" };
  if (brightGreenZone.some(word => addr.includes(word))) return subtotal >= 1500 ? { cost: 0, type: "Бесплатно от 1500₽" } : { cost: 120, type: "Доставка (Солнечный)" };

  // 3. СЕРАЯ ЗОНА (Если адрес не распознан) - 350₽
  return { cost: 500, type: "Другая зона (500)" };
}