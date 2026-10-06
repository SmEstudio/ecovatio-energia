/**
 * ==============================================================================
 * EcoVatio - Calculadoras de Eficiencia Energética y Energía Solar
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCookieBanner();
  initSolarCalculator();
  initApplianceCalculator();
});

/* ==============================================================================
   1. Menú Móvil
   ============================================================================== */
function initMobileNav() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });
  }
}

/* ==============================================================================
   2. Banner de Cookies (RGPD)
   ============================================================================== */
function initCookieBanner() {
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (!cookieBanner) return;

  if (!localStorage.getItem('ecovatio_cookie_consent')) {
    cookieBanner.style.display = 'block';
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('ecovatio_cookie_consent', 'accepted');
      cookieBanner.style.display = 'none';
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('ecovatio_cookie_consent', 'declined');
      cookieBanner.style.display = 'none';
    });
  }
}

/* ==============================================================================
   3. Calculadora de Autoconsumo Solar y Amortización
   ============================================================================== */
function initSolarCalculator() {
  const form = document.getElementById('solar-calc-form');
  if (!form) return;

  const billInput = document.getElementById('solar-monthly-bill');
  const sunHoursSelect = document.getElementById('solar-sun-hours'); // HSP
  const panelPowerInput = document.getElementById('solar-panel-wattage'); // ej 450W

  const resPanels = document.getElementById('res-solar-panels');
  const resPowerKwp = document.getElementById('res-solar-kwp');
  const resYearlySavings = document.getElementById('res-solar-savings');
  const resPayback = document.getElementById('res-solar-payback');

  function calculate() {
    const monthlyBill = parseFloat(billInput.value) || 100;
    const hsp = parseFloat(sunHoursSelect.value) || 4.5; // Horas sol pico promedio
    const panelWatts = parseFloat(panelPowerInput.value) || 450;

    // Estimación energética: precio medio kWh ~ 0.18 €/$
    const priceKwh = 0.18;
    const monthlyKwh = monthlyBill / priceKwh;
    const dailyKwh = monthlyKwh / 30;

    // Objetivo de autoconsumo directo e indirecto: cubrir aprox 65-70% del consumo
    const targetDailySolarKwh = dailyKwh * 0.70;
    // Factor de rendimiento del sistema fotovoltaico (PR ~ 0.78 por pérdidas térmicas e inversor)
    const systemKwpNeeded = targetDailySolarKwh / (hsp * 0.78);

    const panelsNeeded = Math.max(4, Math.ceil((systemKwpNeeded * 1000) / panelWatts));
    const totalActualKwp = (panelsNeeded * panelWatts) / 1000;

    // Ahorro anual estimado (reducción de factura de luz del 65%)
    const annualSavings = (monthlyBill * 0.65) * 12;

    // Coste promedio llave en mano de instalación: aprox 1.100 € por kWp instalado
    const estimatedCost = totalActualKwp * 1100;
    const paybackYears = (estimatedCost / (annualSavings || 1)).toFixed(1);

    if (resPanels) resPanels.textContent = `${panelsNeeded} módulos`;
    if (resPowerKwp) resPowerKwp.textContent = `${totalActualKwp.toFixed(2)} kWp instalados`;
    if (resYearlySavings) resYearlySavings.textContent = `${Math.round(annualSavings).toLocaleString('es-ES')} € / año`;
    if (resPayback) resPayback.textContent = `Aprox. ${paybackYears} años`;
  }

  form.addEventListener('input', calculate);
  calculate();
}

/* ==============================================================================
   4. Calculadora de Consumo de Electrodomésticos y Coste de Luz
   ============================================================================== */
function initApplianceCalculator() {
  const form = document.getElementById('appliance-calc-form');
  if (!form) return;

  const presetSelect = document.getElementById('app-preset');
  const wattsInput = document.getElementById('app-watts');
  const hoursInput = document.getElementById('app-hours');
  const priceInput = document.getElementById('app-kwh-price');

  const resMonthlyKwh = document.getElementById('app-res-kwh');
  const resDailyCost = document.getElementById('app-res-daily');
  const resMonthlyCost = document.getElementById('app-res-monthly');
  const resYearlyCost = document.getElementById('app-res-yearly');

  const presets = {
    frigorifico: { watts: 150, hours: 24 },
    aire: { watts: 1200, hours: 6 },
    lavadora: { watts: 1800, hours: 1.5 },
    termo: { watts: 1500, hours: 4 },
    horno: { watts: 2000, hours: 1 },
    pc: { watts: 200, hours: 8 }
  };

  if (presetSelect) {
    presetSelect.addEventListener('change', () => {
      const selected = presetSelect.value;
      if (presets[selected]) {
        wattsInput.value = presets[selected].watts;
        hoursInput.value = presets[selected].hours;
        calculate();
      }
    });
  }

  function calculate() {
    const watts = parseFloat(wattsInput.value) || 0;
    const hours = parseFloat(hoursInput.value) || 0;
    const priceKwh = parseFloat(priceInput.value) || 0.18;

    const dailyKwh = (watts * hours) / 1000;
    const monthlyKwh = dailyKwh * 30;
    const yearlyKwh = dailyKwh * 365;

    const dailyCost = dailyKwh * priceKwh;
    const monthlyCost = monthlyKwh * priceKwh;
    const yearlyCost = yearlyKwh * priceKwh;

    if (resMonthlyKwh) resMonthlyKwh.textContent = `${monthlyKwh.toFixed(1)} kWh / mes`;
    if (resDailyCost) resDailyCost.textContent = `${dailyCost.toFixed(2)} € / día`;
    if (resMonthlyCost) resMonthlyCost.textContent = `${monthlyCost.toFixed(2)} € / mes`;
    if (resYearlyCost) resYearlyCost.textContent = `${yearlyCost.toFixed(2)} € / año`;
  }

  form.addEventListener('input', calculate);
  calculate();
}
