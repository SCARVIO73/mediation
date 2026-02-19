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

// ─── CITY SEARCH (FIND A MEDIATOR) ───
function initCitySearch() {
  const input = document.getElementById('citySearch');
  const resultsEl = document.getElementById('cityResults');
  const resultsContainer = document.getElementById('cityMediationResults');
  const titleEl = document.getElementById('cityResultsTitle');
  const cardsEl = document.getElementById('centreCards');

  if (!input || !window.MEDIATION_CENTRES) return;

  const cities = window.MEDIATION_CENTRES.cities || [];

  function filterCities(q) {
    const qq = (q || '').trim().toLowerCase();
    if (!qq) return cities.slice(0, 20);
    return cities.filter(c => c.name.toLowerCase().includes(qq)).slice(0, 20);
  }

  function renderDropdown(items) {
    if (!items.length) {
      resultsEl.innerHTML = '<div class="city-result-item city-result-empty">No city found</div>';
      resultsEl.hidden = false;
      return;
    }
    resultsEl.innerHTML = items.map(c => `<div class="city-result-item" role="option" data-city="${c.name}" tabindex="0">${c.name}, ${c.state}</div>`).join('');
    resultsEl.hidden = false;
  }

  function selectCity(cityData) {
    input.value = cityData.name + ', ' + cityData.state;
    resultsEl.hidden = true;

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
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  input.addEventListener('input', function() {
    renderDropdown(filterCities(input.value));
  });

  input.addEventListener('focus', function() {
    renderDropdown(filterCities(input.value));
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') resultsEl.hidden = true;
  });

  resultsEl.addEventListener('click', function(e) {
    const item = e.target.closest('.city-result-item[data-city]');
    if (item) {
      const cityName = item.getAttribute('data-city');
      const cityData = cities.find(c => c.name === cityName);
      if (cityData) selectCity(cityData);
    }
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.city-search-wrapper')) resultsEl.hidden = true;
  });
}

// Init
observeReveals();
if (document.getElementById('citySearch')) initCitySearch();
