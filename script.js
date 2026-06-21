/* ===================================================
   CHRIS FITNESS — Lógica de cálculo
   TDEE: Harris-Benedict (revisada 1984)
   Macros: proteína por kg de peso corporal (recomp-aware)
   ================================================== */

// ---------- estado ----------
const state = {
  sex: 'male',
  goal: 'maintain',
  paceStep: 3, // índice del slider 0-10
};

// Pasos del slider de ritmo: 0.0 a 1.0 kg/semana en incrementos de 0.1
const PACE_STEPS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

// ---------- referencias DOM ----------
const sexGroup = document.getElementById('sexGroup');
const goalGroup = document.getElementById('goalGroup');
const paceField = document.getElementById('paceField');
const paceSlider = document.getElementById('paceSlider');
const paceValue = document.getElementById('paceValue');
const paceNote = document.getElementById('paceNote');
const paceTicks = document.getElementById('paceTicks');

const ageInput = document.getElementById('age');
const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
const activitySelect = document.getElementById('activity');

const calcBtn = document.getElementById('calcBtn');
const formError = document.getElementById('formError');

const resultLocked = document.getElementById('resultLocked');
const resultContent = document.getElementById('resultContent');

// ---------- construir ticks del slider ----------
PACE_STEPS.forEach((val, i) => {
  const tick = document.createElement('span');
  tick.textContent = i === 0 ? '0' : (val % 0.5 === 0 ? val.toFixed(1) : '');
  tick.dataset.index = i;
  paceTicks.appendChild(tick);
});

function updatePaceTicks() {
  [...paceTicks.children].forEach((el, i) => {
    el.classList.toggle('is-current', i === state.paceStep);
  });
}

function paceNoteText(val, goal) {
  if (goal === 'maintain') return 'En mantenimiento no se aplica ritmo de cambio de peso';
  if (val === 0) return 'Sin déficit/superávit — solo recomposición';
  if (val <= 0.3) return 'Ritmo conservador — máxima retención de músculo';
  if (val <= 0.6) return 'Ritmo moderado — recomendado para la mayoría';
  if (val <= 0.8) return 'Ritmo agresivo — requiere buena adherencia';
  return 'Ritmo muy agresivo — solo a corto plazo';
}

function renderPace() {
  const val = PACE_STEPS[state.paceStep];
  paceValue.textContent = val.toFixed(1);
  paceNote.textContent = paceNoteText(val, state.goal);
  updatePaceTicks();
}

// ---------- toggles ----------
function setupToggleGroup(group, stateKey, onChange) {
  group.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state[stateKey] = btn.dataset.value;
      if (onChange) onChange();
    });
  });
}

setupToggleGroup(sexGroup, 'sex');
setupToggleGroup(goalGroup, 'goal', () => {
  const isMaintain = state.goal === 'maintain';
  paceField.classList.toggle('is-disabled', isMaintain);
  renderPace();
});

paceSlider.addEventListener('input', () => {
  state.paceStep = parseInt(paceSlider.value, 10);
  renderPace();
});

renderPace();

// ---------- validación ----------
function validate() {
  const age = parseFloat(ageInput.value);
  const weight = parseFloat(weightInput.value);
  const height = parseFloat(heightInput.value);

  if (!age || age < 14 || age > 90) return 'Pon una edad válida (14–90 años).';
  if (!weight || weight < 30 || weight > 250) return 'Pon un peso válido (30–250 kg).';
  if (!height || height < 120 || height > 230) return 'Pon una altura válida (120–230 cm).';
  return null;
}

// ---------- cálculo TDEE: Harris-Benedict ----------
function calcBMR(sex, weight, height, age) {
  if (sex === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  }
  return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
}

// ---------- cálculo de macros ----------
// Proteína por kg de peso corporal, ajustada según objetivo (recomp-aware)
function proteinPerKg(goal) {
  if (goal === 'lose') return 2.2;   // alta retención muscular en déficit
  if (goal === 'gain') return 2.0;   // suficiente para síntesis proteica en superávit
  return 1.8;                          // mantenimiento
}

function fatPerKg(goal) {
  if (goal === 'lose') return 0.8;
  if (goal === 'gain') return 1.0;
  return 0.9;
}

function calculatePlan() {
  const sex = state.sex;
  const goal = state.goal;
  const age = parseFloat(ageInput.value);
  const weight = parseFloat(weightInput.value);
  const height = parseFloat(heightInput.value);
  const activity = parseFloat(activitySelect.value);

  const bmr = calcBMR(sex, weight, height, age);
  const tdee = bmr * activity;

  const paceKg = goal === 'maintain' ? 0 : PACE_STEPS[state.paceStep];
  // 1 kg de tejido adiposo ≈ 7700 kcal. Repartido en 7 días.
  const dailyAdjustment = (paceKg * 7700) / 7;

  let targetKcal;
  if (goal === 'lose') targetKcal = tdee - dailyAdjustment;
  else if (goal === 'gain') targetKcal = tdee + dailyAdjustment;
  else targetKcal = tdee;

  // suelo de seguridad
  const floor = sex === 'male' ? 1500 : 1200;
  targetKcal = Math.max(targetKcal, floor);

  const proteinG = Math.round(weight * proteinPerKg(goal));
  const fatG = Math.round(weight * fatPerKg(goal));
  const proteinKcal = proteinG * 4;
  const fatKcal = fatG * 9;
  let carbsKcal = targetKcal - proteinKcal - fatKcal;
  if (carbsKcal < 0) carbsKcal = targetKcal * 0.2; // salvaguarda si los datos son extremos
  const carbsG = Math.round(carbsKcal / 4);

  const totalKcalCheck = proteinKcal + fatKcal + (carbsG * 4);

  let etaWeeks = null;
  if (goal !== 'maintain' && paceKg > 0) {
    // estimación a un 10% del peso corporal como objetivo razonable de referencia
    const referenceChangeKg = weight * 0.10;
    etaWeeks = Math.round(referenceChangeKg / paceKg);
  }

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetKcal: Math.round(targetKcal),
    proteinG, fatG, carbsG,
    proteinKcal, fatKcal, carbsKcal: carbsG * 4,
    totalKcalCheck: Math.round(totalKcalCheck),
    etaWeeks,
    goal, paceKg,
  };
}

// ---------- render resultado ----------
const kcalValue = document.getElementById('kcalValue');
const resultGoalLabel = document.getElementById('resultGoalLabel');
const resultExplain = document.getElementById('resultExplain');
const tdeeValue = document.getElementById('tdeeValue');
const etaValue = document.getElementById('etaValue');

const proteinG = document.getElementById('proteinG');
const carbsG = document.getElementById('carbsG');
const fatG = document.getElementById('fatG');
const proteinKcalEl = document.getElementById('proteinKcal');
const carbsKcalEl = document.getElementById('carbsKcal');
const fatKcalEl = document.getElementById('fatKcal');
const proteinBar = document.getElementById('proteinBar');
const carbsBar = document.getElementById('carbsBar');
const fatBar = document.getElementById('fatBar');

const GOAL_LABELS = {
  lose: 'PLAN DE PÉRDIDA DE GRASA',
  maintain: 'PLAN DE MANTENIMIENTO',
  gain: 'PLAN DE GANANCIA MUSCULAR',
};

function goalExplainText(plan) {
  if (plan.goal === 'maintain') {
    return `Estas son tus calorías de mantenimiento. Cómelas para sostener tu peso actual mientras mejoras tu composición corporal.`;
  }
  const verb = plan.goal === 'lose' ? 'déficit' : 'superávit';
  const direction = plan.goal === 'lose' ? 'perder' : 'ganar';
  return `Calculado con un ${verb} de ${Math.round((plan.paceKg*7700)/7)} kcal/día respecto a tu mantenimiento, para ${direction} ~${plan.paceKg.toFixed(1)} kg por semana.`;
}

let lastPlan = null;

function renderResult(plan) {
  lastPlan = plan;

  resultGoalLabel.textContent = GOAL_LABELS[plan.goal];
  kcalValue.textContent = plan.targetKcal.toLocaleString('es-ES');
  resultExplain.textContent = goalExplainText(plan);
  tdeeValue.textContent = plan.tdee.toLocaleString('es-ES') + ' kcal';
  etaValue.textContent = plan.etaWeeks ? `~${plan.etaWeeks} semanas` : '—';

  proteinG.textContent = plan.proteinG;
  carbsG.textContent = plan.carbsG;
  fatG.textContent = plan.fatG;
  proteinKcalEl.textContent = plan.proteinKcal.toLocaleString('es-ES') + ' kcal';
  carbsKcalEl.textContent = plan.carbsKcal.toLocaleString('es-ES') + ' kcal';
  fatKcalEl.textContent = plan.fatKcal.toLocaleString('es-ES') + ' kcal';

  const total = plan.totalKcalCheck || 1;
  requestAnimationFrame(() => {
    proteinBar.style.width = Math.round((plan.proteinKcal / total) * 100) + '%';
    carbsBar.style.width = Math.round((plan.carbsKcal / total) * 100) + '%';
    fatBar.style.width = Math.round((plan.fatKcal / total) * 100) + '%';
  });

  resultLocked.style.display = 'none';
  resultContent.classList.add('is-visible');
}

// ---------- menú de comidas ----------
const menuSection = document.getElementById('menuSection');
const menuTabs = document.getElementById('menuTabs');
const menuBoard = document.getElementById('menuBoard');

const MEAL_LABELS = { breakfast: 'Desayuno', lunch: 'Comida', dinner: 'Cena' };
let currentMealOptions = [];

function renderMealCard(mealKey, meal) {
  const itemsHtml = meal.items.map(it => `
    <div class="meal-card__item">
      <span class="meal-card__item-name">${it.name}</span>
      <span class="meal-card__item-grams">${it.grams}g</span>
    </div>
  `).join('');

  return `
    <div class="meal-card">
      <div class="meal-card__head">
        <h4 class="meal-card__title">${MEAL_LABELS[mealKey]}</h4>
        <span class="meal-card__kcal">${meal.totals.kcal.toLocaleString('es-ES')} kcal</span>
      </div>
      <div class="meal-card__items">${itemsHtml}</div>
      <div class="meal-card__macros">
        <span>Proteína <b>${meal.totals.p}g</b></span>
        <span>Carbos <b>${meal.totals.c}g</b></span>
        <span>Grasas <b>${meal.totals.f}g</b></span>
      </div>
    </div>
  `;
}

function renderMenuOption(index) {
  const opt = currentMealOptions[index];
  if (!opt) return;

  const cardsHtml = ['breakfast', 'lunch', 'dinner'].map(key => renderMealCard(key, opt[key])).join('');

  menuBoard.innerHTML = `
    ${cardsHtml}
    <div class="menu__daytotal">
      <div class="menu__daytotal-item"><span>Calorías</span><strong>${opt.dayTotals.kcal.toLocaleString('es-ES')}</strong></div>
      <div class="menu__daytotal-item"><span>Proteína</span><strong>${opt.dayTotals.p}g</strong></div>
      <div class="menu__daytotal-item"><span>Carbos</span><strong>${opt.dayTotals.c}g</strong></div>
      <div class="menu__daytotal-item"><span>Grasas</span><strong>${opt.dayTotals.f}g</strong></div>
    </div>
  `;

  [...menuTabs.children].forEach((tab, i) => tab.classList.toggle('is-active', i === index));
}

function renderMenu(plan) {
  currentMealOptions = generateMealOptions(plan.proteinG, plan.carbsG, plan.fatG, 3);

  menuTabs.innerHTML = currentMealOptions.map((_, i) => `
    <button type="button" class="menu-tab" data-index="${i}">Opción ${i + 1}</button>
  `).join('');

  [...menuTabs.children].forEach((tab, i) => {
    tab.addEventListener('click', () => renderMenuOption(i));
  });

  renderMenuOption(0);
  menuSection.classList.add('is-visible');
}

const menuRefreshBtn = document.getElementById('menuRefreshBtn');
menuRefreshBtn.addEventListener('click', () => {
  if (!lastPlan) return;
  renderMenu(lastPlan);
});

// ---------- submit ----------
calcBtn.addEventListener('click', () => {
  const error = validate();
  if (error) {
    formError.textContent = error;
    return;
  }
  formError.textContent = '';
  const plan = calculatePlan();
  renderResult(plan);
  renderMenu(plan);

  // scroll suave hacia el resultado en móvil
  if (window.innerWidth < 980) {
    document.getElementById('resultPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
