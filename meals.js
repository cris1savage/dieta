/* ===================================================
   CHRIS FITNESS — Generador de menús
   Combina alimentos reales (macros por 100g) para encajar
   con los gramos de proteína/carbos/grasa ya calculados.
   Sin IA, sin backend: todo corre en el navegador.
   ================================================== */

// ---------- base de alimentos (macros por 100g + ración realista en gramos) ----------
const FOODS = {
  protein: [
    { name: 'Pechuga de pollo a la plancha', p: 31, c: 0, f: 3.6, kcal: 165, min: 100, max: 300 },
    { name: 'Solomillo de ternera', p: 30, c: 0, f: 8, kcal: 200, min: 100, max: 280 },
    { name: 'Salmón al horno', p: 25, c: 0, f: 13, kcal: 210, min: 100, max: 300 },
    { name: 'Claras de huevo', p: 11, c: 0.7, f: 0.2, kcal: 52, min: 150, max: 500 },
    { name: 'Huevos enteros', p: 13, c: 1.1, f: 11, kcal: 155, min: 100, max: 300 },
    { name: 'Atún al natural', p: 26, c: 0, f: 1, kcal: 116, min: 80, max: 280 },
    { name: 'Pavo a la plancha', p: 29, c: 0, f: 2, kcal: 135, min: 100, max: 280 },
    { name: 'Tofu firme', p: 15, c: 2, f: 8, kcal: 144, min: 100, max: 350 },
    { name: 'Yogur griego natural 0%', p: 10, c: 4, f: 0.4, kcal: 59, min: 125, max: 400 },
    { name: 'Queso fresco batido 0%', p: 12, c: 4, f: 0.2, kcal: 68, min: 125, max: 400 },
    { name: 'Merluza al vapor', p: 23, c: 0, f: 1.3, kcal: 110, min: 100, max: 300 },
    { name: 'Gambas a la plancha', p: 24, c: 0.2, f: 0.3, kcal: 99, min: 100, max: 300 },
  ],
  carb: [
    { name: 'Arroz blanco cocido', p: 2.7, c: 28, f: 0.3, kcal: 130, min: 80, max: 350 },
    { name: 'Patata cocida', p: 2, c: 17, f: 0.1, kcal: 77, min: 100, max: 400 },
    { name: 'Boniato asado', p: 1.6, c: 20, f: 0.1, kcal: 86, min: 100, max: 350 },
    { name: 'Avena en copos', p: 13, c: 60, f: 7, kcal: 380, min: 40, max: 100 },
    { name: 'Pasta integral cocida', p: 5, c: 25, f: 1.1, kcal: 124, min: 80, max: 350 },
    { name: 'Pan integral', p: 9, c: 41, f: 3.5, kcal: 247, min: 40, max: 150 },
    { name: 'Quinoa cocida', p: 4.4, c: 21, f: 1.9, kcal: 120, min: 80, max: 350 },
    { name: 'Tortitas de maíz', p: 8, c: 77, f: 3.5, kcal: 380, min: 30, max: 100 },
    { name: 'Plátano', p: 1.1, c: 23, f: 0.3, kcal: 89, min: 100, max: 200 },
    { name: 'Legumbres cocidas (lentejas)', p: 9, c: 20, f: 0.4, kcal: 116, min: 100, max: 350 },
  ],
  fat: [
    { name: 'Aceite de oliva virgen extra', p: 0, c: 0, f: 100, kcal: 884, min: 3, max: 25 },
    { name: 'Aguacate', p: 2, c: 9, f: 15, kcal: 160, min: 20, max: 150 },
    { name: 'Almendras', p: 21, c: 22, f: 49, kcal: 579, min: 8, max: 40 },
    { name: 'Mantequilla de cacahuete natural', p: 25, c: 20, f: 50, kcal: 588, min: 8, max: 35 },
    { name: 'Nueces', p: 15, c: 14, f: 65, kcal: 654, min: 8, max: 35 },
  ],
  veg: [
    { name: 'Brócoli al vapor', p: 2.8, c: 7, f: 0.4, kcal: 34, min: 100, max: 200 },
    { name: 'Espinacas salteadas', p: 2.9, c: 3.6, f: 0.4, kcal: 23, min: 100, max: 200 },
    { name: 'Ensalada mixta', p: 1.2, c: 4, f: 0.2, kcal: 20, min: 100, max: 200 },
    { name: 'Pimientos a la plancha', p: 1, c: 6, f: 0.3, kcal: 31, min: 100, max: 200 },
    { name: 'Calabacín salteado', p: 1.2, c: 3.1, f: 0.3, kcal: 17, min: 100, max: 200 },
    { name: 'Judías verdes', p: 1.8, c: 7, f: 0.2, kcal: 31, min: 100, max: 200 },
  ],
};

// ---------- base de alimentos de DESAYUNO (estilo español/mediterráneo) ----------
// Categorías propias: pan/base, proteína de desayuno, lácteo, grasa, fruta
const BREAKFAST_FOODS = {
  bread: [
    { name: 'Pan integral', p: 9, c: 41, f: 3.5, kcal: 247, min: 40, max: 120 },
    { name: 'Pan blanco', p: 8, c: 49, f: 1.2, kcal: 265, min: 40, max: 120 },
    { name: 'Tostadas integrales', p: 10, c: 60, f: 5, kcal: 320, min: 30, max: 90 },
  ],
  oats: [
    { name: 'Avena en copos', p: 13, c: 60, f: 7, kcal: 380, min: 40, max: 100 },
    { name: 'Tortitas de avena', p: 12, c: 55, f: 8, kcal: 350, min: 40, max: 100 },
  ],
  protein: [
    { name: 'Huevos enteros', p: 13, c: 1.1, f: 11, kcal: 155, min: 50, max: 180 },
    { name: 'Claras de huevo', p: 11, c: 0.7, f: 0.2, kcal: 52, min: 100, max: 250 },
    { name: 'Jamón cocido', p: 18, c: 1, f: 5, kcal: 120, min: 30, max: 100 },
    { name: 'Jamón serrano', p: 30, c: 0.5, f: 8, kcal: 195, min: 20, max: 80 },
    { name: 'Pechuga de pavo en fiambre', p: 22, c: 1.5, f: 2, kcal: 105, min: 30, max: 100 },
    { name: 'Queso fresco batido 0%', p: 12, c: 4, f: 0.2, kcal: 68, min: 100, max: 250 },
    { name: 'Yogur griego natural 0%', p: 10, c: 4, f: 0.4, kcal: 59, min: 125, max: 250 },
  ],
  dairy: [
    { name: 'Leche semidesnatada', p: 3.3, c: 4.8, f: 1.6, kcal: 47, min: 150, max: 300 },
    { name: 'Bebida de avena', p: 1, c: 7, f: 1.5, kcal: 45, min: 150, max: 300 },
  ],
  fat: [
    { name: 'Aceite de oliva virgen extra', p: 0, c: 0, f: 100, kcal: 884, min: 3, max: 15 },
    { name: 'Aguacate', p: 2, c: 9, f: 15, kcal: 160, min: 20, max: 100 },
    { name: 'Mantequilla de cacahuete natural', p: 25, c: 20, f: 50, kcal: 588, min: 8, max: 30 },
    { name: 'Almendras', p: 21, c: 22, f: 49, kcal: 579, min: 8, max: 30 },
  ],
  fruit: [
    { name: 'Plátano', p: 1.1, c: 23, f: 0.3, kcal: 89, min: 100, max: 200 },
    { name: 'Manzana', p: 0.3, c: 14, f: 0.2, kcal: 52, min: 100, max: 200 },
    { name: 'Naranja', p: 0.9, c: 12, f: 0.1, kcal: 47, min: 100, max: 200 },
    { name: 'Fresas', p: 0.7, c: 8, f: 0.3, kcal: 32, min: 100, max: 250 },
    { name: 'Kiwi', p: 1.1, c: 15, f: 0.5, kcal: 61, min: 80, max: 200 },
  ],
};

// ---------- utilidades ----------
function pickRandom(arr, exclude = []) {
  const pool = arr.filter(item => !exclude.includes(item.name));
  const source = pool.length ? pool : arr;
  return source[Math.floor(Math.random() * source.length)];
}

function roundTo5(n) {
  return Math.round(n / 5) * 5;
}

function gramsForMacro(food, macroKey, targetGrams, min, max) {
  const per100 = food[macroKey];
  if (!per100 || per100 <= 0) return min;
  let grams = (targetGrams / per100) * 100;
  grams = Math.max(min, Math.min(max, grams));
  return roundTo5(grams);
}

function scaleFood(food, grams) {
  const factor = grams / 100;
  return {
    name: food.name,
    grams,
    p: Math.round(food.p * factor * 10) / 10,
    c: Math.round(food.c * factor * 10) / 10,
    f: Math.round(food.f * factor * 10) / 10,
    kcal: Math.round(food.kcal * factor),
  };
}

// ---------- construir una comida ----------
// targetP/C/F en gramos para ESTA comida (ya repartidos del total del día)
function buildMeal(targetP, targetC, targetF, usedNames = []) {
  const proteinFood = pickRandom(FOODS.protein, usedNames);
  const carbFood = pickRandom(FOODS.carb, usedNames);
  const fatFood = pickRandom(FOODS.fat, usedNames);
  const vegFood = pickRandom(FOODS.veg, usedNames);

  // 0. Verdura primero (ración fija) — se descuenta del target antes de calcular el resto
  const vegItem = scaleFood(vegFood, 120);

  // 1. Carbohidrato: estimación inicial asumiendo que la proteína no aporta carbos (ajuste fino después)
  const carbGrams = gramsForMacro(carbFood, 'c', Math.max(0, targetC - vegItem.c), carbFood.min, carbFood.max);
  const carbItem = scaleFood(carbFood, carbGrams);

  // Si el carbo principal no llegó al objetivo (tocó su ración máxima), añadir fruta de apoyo
  const carbShortfall = (targetC - vegItem.c) - carbItem.c;
  const extraItems = [];
  if (carbShortfall > 20) {
    const fruitFood = FOODS.carb.find(f => f.name === 'Plátano');
    const fruitGrams = gramsForMacro(fruitFood, 'c', carbShortfall, fruitFood.min, fruitFood.max);
    const fruitItem = scaleFood(fruitFood, fruitGrams);
    extraItems.push(fruitItem);

    // Si con la fruta tampoco llega (targets muy altos de carbo), añadir pan integral como tercer aporte
    const stillShort = carbShortfall - fruitItem.c;
    if (stillShort > 20) {
      const breadFood = FOODS.carb.find(f => f.name === 'Pan integral');
      const breadGrams = gramsForMacro(breadFood, 'c', stillShort, breadFood.min, breadFood.max);
      extraItems.push(scaleFood(breadFood, breadGrams));
    }
  }

  // 2. Proteína: ahora que sabemos cuánta proteína "regalan" carbo+fruta+verdura, ajustamos la ración principal
  const proteinFromOthers = carbItem.p + vegItem.p + extraItems.reduce((s, it) => s + it.p, 0);
  const proteinStillNeeded = Math.max(0, targetP - proteinFromOthers);
  const proteinGrams = gramsForMacro(proteinFood, 'p', proteinStillNeeded, proteinFood.min, proteinFood.max);
  const proteinItem = scaleFood(proteinFood, proteinGrams);

  const items = [proteinItem, carbItem, vegItem, ...extraItems];

  // 3. Grasa: cubrir solo lo que falte tras proteína + carbo + verdura, con ración pequeña y acotada.
  // Si ya hay exceso de grasa (proteína grasa + carbo graso), no añadimos nada más.
  const fatAlready = items.reduce((sum, it) => sum + it.f, 0);
  const fatNeeded = targetF - fatAlready;

  if (fatNeeded > 3) {
    const fatGrams = gramsForMacro(fatFood, 'f', fatNeeded, fatFood.min, fatFood.max);
    items.push(scaleFood(fatFood, fatGrams));
  }

  const totals = items.reduce((acc, it) => ({
    p: acc.p + it.p, c: acc.c + it.c, f: acc.f + it.f, kcal: acc.kcal + it.kcal,
  }), { p: 0, c: 0, f: 0, kcal: 0 });

  return {
    items,
    totals: {
      p: Math.round(totals.p), c: Math.round(totals.c), f: Math.round(totals.f), kcal: Math.round(totals.kcal),
    },
    usedNames: items.map(it => it.name),
  };
}

// ---------- construir un DESAYUNO realista ----------
// En vez de combinar categorías al azar, usamos "patrones" típicos de desayuno español
// (pan+huevos, pan+fiambre, avena+lácteo+fruta...) para que la combinación tenga sentido.
const BREAKFAST_PATTERNS = [
  // Patrón 1: pan + huevo + grasa (tostada con huevo)
  () => ({ bread: true, protein: ['Huevos enteros', 'Claras de huevo'], fat: true, fruit: false }),
  // Patrón 2: pan + fiambre/jamón + queso (tostada con jamón y queso)
  () => ({ bread: true, protein: ['Jamón cocido', 'Jamón serrano', 'Pechuga de pavo en fiambre'], fat: false, fruit: false }),
  // Patrón 3: avena + lácteo + fruta (bowl de avena)
  () => ({ oats: true, protein: false, dairy: true, fruit: true }),
  // Patrón 4: pan + aguacate + huevo (tostada de aguacate)
  () => ({ bread: true, protein: ['Huevos enteros', 'Claras de huevo'], fat: ['Aguacate'], fruit: false }),
  // Patrón 5: yogur/queso fresco + fruta + pan (desayuno ligero)
  () => ({ bread: true, protein: ['Yogur griego natural 0%', 'Queso fresco batido 0%'], fruit: true, fat: false }),
];

function pickFromList(list, names) {
  const filtered = list.filter(f => names.includes(f.name));
  return filtered[Math.floor(Math.random() * filtered.length)] || pickRandom(list);
}

function buildBreakfast(targetP, targetC, targetF) {
  const pattern = BREAKFAST_PATTERNS[Math.floor(Math.random() * BREAKFAST_PATTERNS.length)]();
  const items = [];

  // 1. Proteína principal del desayuno (huevo, jamón, fiambre, yogur...)
  let proteinItem = null;
  if (pattern.protein) {
    const proteinFood = Array.isArray(pattern.protein)
      ? pickFromList(BREAKFAST_FOODS.protein, pattern.protein)
      : pickRandom(BREAKFAST_FOODS.protein);
    const proteinGrams = gramsForMacro(proteinFood, 'p', targetP, proteinFood.min, proteinFood.max);
    proteinItem = scaleFood(proteinFood, proteinGrams);
    items.push(proteinItem);
  }

  // 2. Base de carbohidrato: pan clásico O avena, nunca mezclados (son patrones distintos)
  let carbItem = null;
  const carbTarget = Math.max(0, targetC - (proteinItem ? proteinItem.c : 0));
  if (pattern.oats) {
    const oatsFood = pickRandom(BREAKFAST_FOODS.oats);
    const oatsGrams = gramsForMacro(oatsFood, 'c', carbTarget, oatsFood.min, oatsFood.max);
    carbItem = scaleFood(oatsFood, oatsGrams);
    items.push(carbItem);
  } else if (pattern.bread) {
    const breadFood = pickRandom(BREAKFAST_FOODS.bread);
    const breadGrams = gramsForMacro(breadFood, 'c', carbTarget, breadFood.min, breadFood.max);
    carbItem = scaleFood(breadFood, breadGrams);
    items.push(carbItem);
  }

  // 3. Lácteo (si el patrón lo pide, ej. bowl de avena con leche)
  if (pattern.dairy) {
    const dairyFood = pickRandom(BREAKFAST_FOODS.dairy);
    items.push(scaleFood(dairyFood, 200));
  }

  // 4. Fruta (si el patrón lo pide)
  let fruitItem = null;
  if (pattern.fruit) {
    const fruitFood = pickRandom(BREAKFAST_FOODS.fruit);
    fruitItem = scaleFood(fruitFood, 150);
    items.push(fruitItem);
  }

  // 5. Si aún falta carbohidrato y no hubo pan/avena en el patrón, añadir fruta de apoyo
  const carbSoFar = items.reduce((s, it) => s + it.c, 0);
  if (!carbItem && carbSoFar < targetC - 15) {
    const exclude = fruitItem ? [fruitItem.name] : [];
    const fruitFood = pickRandom(BREAKFAST_FOODS.fruit, exclude);
    const fruitGrams = gramsForMacro(fruitFood, 'c', targetC - carbSoFar, fruitFood.min, fruitFood.max);
    items.push(scaleFood(fruitFood, fruitGrams));
  }

  // 6. Grasa: cubrir lo que falte, con ración acotada
  const fatAlready = items.reduce((s, it) => s + it.f, 0);
  const fatNeeded = targetF - fatAlready;
  if (fatNeeded > 3) {
    const fatFood = pattern.fat && Array.isArray(pattern.fat)
      ? pickFromList(BREAKFAST_FOODS.fat, pattern.fat)
      : pickRandom(BREAKFAST_FOODS.fat);
    const fatGrams = gramsForMacro(fatFood, 'f', fatNeeded, fatFood.min, fatFood.max);
    items.push(scaleFood(fatFood, fatGrams));
  }

  const totals = items.reduce((acc, it) => ({
    p: acc.p + it.p, c: acc.c + it.c, f: acc.f + it.f, kcal: acc.kcal + it.kcal,
  }), { p: 0, c: 0, f: 0, kcal: 0 });

  return {
    items,
    totals: {
      p: Math.round(totals.p), c: Math.round(totals.c), f: Math.round(totals.f), kcal: Math.round(totals.kcal),
    },
    usedNames: items.map(it => it.name),
  };
}

// ---------- construir una opción completa de día (desayuno/comida/cena) ----------
// Reparto: desayuno 25%, comida 40%, cena 35%
function buildDayOption(totalP, totalC, totalF) {
  const split = {
    breakfast: 0.25,
    lunch: 0.40,
    dinner: 0.35,
  };

  const breakfast = buildBreakfast(totalP * split.breakfast, totalC * split.breakfast, totalF * split.breakfast);
  const usedNames = [...breakfast.usedNames];

  const lunch = buildMeal(totalP * split.lunch, totalC * split.lunch, totalF * split.lunch, usedNames);
  usedNames.push(...lunch.usedNames);

  const dinner = buildMeal(totalP * split.dinner, totalC * split.dinner, totalF * split.dinner, usedNames);

  const dayTotals = ['p', 'c', 'f', 'kcal'].reduce((acc, key) => {
    acc[key] = breakfast.totals[key] + lunch.totals[key] + dinner.totals[key];
    return acc;
  }, {});

  return { breakfast, lunch, dinner, dayTotals };
}

// ---------- generar N opciones distintas ----------
function generateMealOptions(totalP, totalC, totalF, count = 3) {
  const options = [];
  for (let i = 0; i < count; i++) {
    options.push(buildDayOption(totalP, totalC, totalF));
  }
  return options;
}
