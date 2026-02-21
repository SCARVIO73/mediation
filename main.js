// ─── NAVIGATION ───
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');

  // Update active nav
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('onclick') && a.getAttribute('onclick').includes(pageId)) {
      a.classList.add('active');
    }
  });

  // Close mobile menu
  document.getElementById('navLinks').classList.remove('open');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-observe reveals
  setTimeout(observeReveals, 100);
}

// ─── HAMBURGER ───
document.getElementById('hamburger').addEventListener('click', function() {
  document.getElementById('navLinks').classList.toggle('open');
});

// ─── NAVBAR SCROLL ───
window.addEventListener('scroll', function() {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
});

// ─── FAQ ACCORDION ───
function toggleFaq(btn) {
  const item = btn.parentElement;
  const answer = item.querySelector('.faq-answer');
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item').forEach(f => {
    f.classList.remove('open');
    f.querySelector('.faq-answer').style.maxHeight = '0';
  });

  if (!isOpen) {
    item.classList.add('open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
}

// ─── CONTACT FORM ───
function handleSubmit(e) {
  e.preventDefault();
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('formSuccess').classList.add('show');
}

// ─── SCROLL REVEAL ───
function observeReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

// ─── PDF DOWNLOADS (RESOURCES) ───
function downloadSampleMediationAgreement() {
  if (typeof window.jspdf === 'undefined') {
    alert('PDF library is loading. Please try again in a moment.');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Sample Mediation Settlement Agreement', 20, 25);
  doc.setFontSize(10);
  const lines = [
    'This sample is for general informational purposes only. It is not legal advice.',
    'Consult a qualified professional for your situation.',
    '',
    'This Agreement is made on: ____________ (Date)',
    'Between:',
    'Party A: _______________________________________________',
    'Address: ________________________________________________',
    'Party B: _______________________________________________',
    'Address: ________________________________________________',
    '',
    '1. Background / Dispute: ______________________',
    '',
    '2. Settlement Terms:',
    '   (a) ______________________________________________________',
    '   (b) ______________________________________________________',
    '   (c) ______________________________________________________',
    '',
    '3. Payment / Performance (if applicable):',
    '   Amount: ____________  Due date(s): ________________________',
    '',
    '4. Confidentiality: The Parties agree to keep mediation communications',
    '   confidential, subject to applicable law.',
    '',
    '5. Full and Final Settlement: Upon performance, the dispute stands resolved.',
    '',
    '6. Voluntary Agreement: Each Party confirms they sign voluntarily.',
    '',
    'Signatures:',
    'Party A Signature: ____________________  Date: ____________',
    'Party B Signature: ____________________  Date: ____________',
    'Mediator (optional): ___________________  Date: ____________'
  ];
  let y = 35;
  for (const line of lines) {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.text(line, 20, y);
    y += 6;
  }
  doc.save('Sample-Mediation-Agreement.pdf');
}

function downloadMediationActMarathiSummary() {
  if (typeof window.jspdf === 'undefined') {
    alert('PDF library is loading. Please try again in a moment.');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Mediation Act, 2023 — Marathi Summary', 20, 25);
  doc.setFontSize(10);
  const lines = [
    'Note: This is an English-language summary for Marathi readers.',
    'Use the official (EN/HI) government PDF link for the full Act.',
    '',
    'Purpose: Promote mediation and make dispute resolution faster and accessible.',
    'Key features: confidentiality, voluntary participation, neutral mediator,',
    'enforceable settlement agreements.',
    'Online mediation: allows conducting mediation through online modes where appropriate.',
    '',
    'This document is informational and not legal advice.'
  ];
  let y = 35;
  for (const line of lines) {
    doc.text(line, 20, y);
    y += 6;
  }
  doc.save('Mediation-Act-2023-Marathi-Summary.pdf');
}

// ─── CITY SEARCH (FIND A MEDIATOR) ─── BookMyShow-style
const POPULAR_CITIES = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata',
  'Ahmedabad', 'Pune', 'Chandigarh', 'Jaipur', 'Kochi', 'Lucknow'
];

function initCitySearch() {
  const input = document.getElementById('citySearch');
  const popularEl = document.getElementById('popularCities');
  const otherWrapper = document.getElementById('cityOtherWrapper');
  const otherListEl = document.getElementById('cityOtherList');
  const toggleBtn = document.getElementById('cityToggleBtn');
  const detectBtn = document.getElementById('cityDetectBtn');
  const resultsContainer = document.getElementById('cityMediationResults');
  const titleEl = document.getElementById('cityResultsTitle');
  const cardsEl = document.getElementById('centreCards');

  if (!input || !window.MEDIATION_CENTRES) return;

  const cities = window.MEDIATION_CENTRES.cities || [];

  function selectCity(cityData) {
    titleEl.textContent = `Mediation Centres in ${cityData.name}`;
    cardsEl.innerHTML = cityData.centres.map(c => `
      <div class="centre-card centre-card--${c.type}">
        <span class="centre-type">${c.type === 'government' ? 'Government' : 'Private'}</span>
        <h4>${c.name}</h4>
        <p class="centre-address">${c.address}</p>
        ${c.phone ? `<p class="centre-contact"><strong>Phone:</strong> ${c.phone}</p>` : ''}
        ${c.email ? `<p class="centre-contact"><strong>Email:</strong> <a href="mailto:${c.email}">${c.email}</a></p>` : ''}
      </div>
    `).join('');

    resultsContainer.hidden = false;
    input.value = '';
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (toggleBtn && otherWrapper && otherWrapper.hidden === false) {
      otherWrapper.hidden = true;
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.querySelector('.city-toggle-text').textContent = 'Show all cities';
      toggleBtn.querySelector('.city-toggle-icon').style.transform = 'rotate(0deg)';
    }
  }

  function renderPopularCities() {
    const popular = POPULAR_CITIES
      .map(name => cities.find(c => c.name === name))
      .filter(Boolean);
    if (!popularEl) return;
    popularEl.innerHTML = popular.map(c => `
      <button type="button" class="city-chip" data-city="${c.name}" aria-label="Select ${c.name}">
        <span class="city-chip-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </span>
        <span class="city-chip-name">${c.name}</span>
      </button>
    `).join('');
  }

  function getCitiesByLetter() {
    const sorted = [...cities].sort((a, b) => a.name.localeCompare(b.name));
    const byLetter = {};
    sorted.forEach(c => {
      const letter = c.name.charAt(0).toUpperCase();
      if (!byLetter[letter]) byLetter[letter] = [];
      byLetter[letter].push(c);
    });
    return byLetter;
  }

  function renderOtherCities(filter) {
    const q = (filter || '').trim().toLowerCase();
    let toShow = cities;
    if (q) {
      toShow = cities.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q)
      );
    }
    const sorted = [...toShow].sort((a, b) => a.name.localeCompare(b.name));
    const byLetter = {};
    sorted.forEach(c => {
      const letter = c.name.charAt(0).toUpperCase();
      if (!byLetter[letter]) byLetter[letter] = [];
      byLetter[letter].push(c);
    });

    const html = Object.keys(byLetter)
      .sort()
      .map(letter => `
        <div class="city-letter-group">
          <div class="city-letter-heading">${letter}</div>
          <div class="city-letter-cities">
            ${byLetter[letter].map(c => `<button type="button" class="city-other-item" data-city="${c.name}">${c.name}</button>`).join('')}
          </div>
        </div>
      `).join('');

    if (otherListEl) otherListEl.innerHTML = html || '<p class="city-no-results">No cities match your search.</p>';
  }

  function toggleOtherCities() {
    if (!otherWrapper || !toggleBtn) return;
    const isOpen = !otherWrapper.hidden;
    otherWrapper.hidden = isOpen;
    toggleBtn.setAttribute('aria-expanded', !isOpen);
    toggleBtn.querySelector('.city-toggle-text').textContent = isOpen ? 'Show all cities' : 'Hide all cities';
    toggleBtn.querySelector('.city-toggle-icon').style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
  }

  renderPopularCities();
  renderOtherCities();

  if (popularEl) {
    popularEl.addEventListener('click', (e) => {
      const chip = e.target.closest('.city-chip[data-city]');
      if (chip) {
        const cityData = cities.find(c => c.name === chip.getAttribute('data-city'));
        if (cityData) selectCity(cityData);
      }
    });
  }

  if (otherListEl) {
    otherListEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.city-other-item[data-city]');
      if (btn) {
        const cityData = cities.find(c => c.name === btn.getAttribute('data-city'));
        if (cityData) selectCity(cityData);
      }
    });
  }

  input.addEventListener('input', function() {
    renderOtherCities(input.value);
    if (otherWrapper && !otherWrapper.hidden) return;
    if (input.value.trim()) {
      otherWrapper.hidden = false;
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.querySelector('.city-toggle-text').textContent = 'Hide all cities';
        toggleBtn.querySelector('.city-toggle-icon').style.transform = 'rotate(180deg)';
      }
    }
  });

  if (toggleBtn) toggleBtn.addEventListener('click', toggleOtherCities);

  if (detectBtn) {
    detectBtn.addEventListener('click', function() {
      if (!navigator.geolocation) {
        alert('Location is not supported by your browser.');
        return;
      }
      detectBtn.disabled = true;
      detectBtn.classList.add('city-detect-btn--loading');
      navigator.geolocation.getCurrentPosition(
        function(pos) {
          detectBtn.disabled = false;
          detectBtn.classList.remove('city-detect-btn--loading');
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then(r => r.json())
            .then(data => {
              const city = data.address?.city || data.address?.town || data.address?.district || data.address?.state_district;
              if (city) {
                const cityData = cities.find(c => c.name.toLowerCase() === city.toLowerCase()) ||
                  cities.find(c => c.name.toLowerCase().includes(city.toLowerCase()) || city.toLowerCase().includes(c.name.toLowerCase()));
                if (cityData) selectCity(cityData);
                else { input.value = city; renderOtherCities(city); otherWrapper.hidden = false; }
              }
            })
            .catch(() => {
              detectBtn.disabled = false;
              detectBtn.classList.remove('city-detect-btn--loading');
            });
        },
        function() {
          detectBtn.disabled = false;
          detectBtn.classList.remove('city-detect-btn--loading');
        }
      );
    });
  }
}

// Init
observeReveals();
if (document.getElementById('citySearch')) initCitySearch();
