const COUNTER_API_URL = 'https://script.google.com/macros/s/AKfycbx-zjYF9ujaahSRr6k270D5Ktzfw6ZFI17AJiBlNcQDR9u3TpkwJLnjbz-jo_riFFIV/exec';

async function updateFirmCounter() {
  const el = document.getElementById('pocet-firem');
  if (!el) return;

  const cached = sessionStorage.getItem('tisnov_count');
  if (cached && Number(cached) > 0) {
    el.textContent = cached;
    return;
  }

  try {
    const res = await fetch(COUNTER_API_URL, { redirect: 'follow' });
    const data = await res.json();
    if (data.count !== undefined) {
      el.textContent = data.count;
      if (data.count > 0) {
        sessionStorage.setItem('tisnov_count', data.count);
      }
    }
  } catch (e) {
    console.error('Chyba načítání počítadla:', e);
  }
}

updateFirmCounter();