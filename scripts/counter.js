// Počítadlo zapojených firem – čte číslo z Apps Script web appu
const COUNTER_API_URL = 'https://script.google.com/macros/s/AKfycby8033UJlVM1Xbf4G8wXyad68jYrCUZVnlGW62pIJRYVgPhoXbdOUNsYU7-wJy0QhwT/exec';
const COUNTER_KEY = 'tisnov_count_v2';
const COUNTER_TTL = 60 * 1000; // uložené číslo považujeme za čerstvé 60 s

const MIN_ZOBRAZIT = 25; // pod tímto počtem místo čísla ukážeme „Zapojují se první firmy“

function showCount(el, n) {
  const box = document.querySelector('.counter');
  if (!box) return;
  box.innerHTML = n < MIN_ZOBRAZIT
    ? '<span class="dot"></span>Zapojují se první firmy'
    : '<span class="dot"></span>Zapojilo se už <strong id="pocet-firem">' + n + '</strong> firem';
}

async function updateFirmCounter() {
  const el = document.getElementById('pocet-firem');
  if (!el) return;

  // 1) okamžitě ukázat poslední známou hodnotu (pokud je)
  let cached = null;
  try { cached = JSON.parse(localStorage.getItem(COUNTER_KEY) || 'null'); } catch (e) {}
  if (cached && typeof cached.n === 'number') {
    showCount(el, cached.n);
    if (Date.now() - cached.t < COUNTER_TTL) return;
  }

  // 2) vždy (po vypršení TTL) načíst aktuální číslo – Apps Script bývá 1–3 s pomalý
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(COUNTER_API_URL + '?t=' + Date.now(), {
      redirect: 'follow', cache: 'no-store', signal: ctrl.signal,
    });
    const data = await res.json();
    const n = Number(data.count);
    if (Number.isFinite(n) && n >= 0) {
      showCount(el, n);
      try { localStorage.setItem(COUNTER_KEY, JSON.stringify({ n, t: Date.now() })); } catch (e) {}
    }
  } catch (e) {
    console.warn('Počítadlo se nenačetlo:', e);
  } finally {
    clearTimeout(timer);
  }
}

updateFirmCounter();
