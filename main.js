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
function escapePdfString(str) {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function buildSimplePdfBytes(lines, { title = 'Document', filename = 'document.pdf' } = {}) {
  const encoder = new TextEncoder();

  // Minimal single-page PDF with built-in Helvetica.
  const header = '%PDF-1.4\n%PDFGEN\n';

  const contentLines = [];
  contentLines.push('BT\n');
  contentLines.push('/F1 16 Tf\n');
  contentLines.push('72 760 Td\n');
  contentLines.push(`(${escapePdfString(title)}) Tj\n`);
  contentLines.push('/F1 10 Tf\n');
  contentLines.push('0 -22 Td\n');

  for (const line of lines) {
    contentLines.push(`(${escapePdfString(line)}) Tj\n`);
    contentLines.push('0 -14 Td\n');
  }

  contentLines.push('ET\n');
  const contentStream = contentLines.join('');
  const contentStreamBytes = encoder.encode(contentStream);

  const chunks = [];
  let pos = 0;
  const offsets = [0]; // object 0 is special; placeholder for convenience

  function pushStr(str) {
    const bytes = encoder.encode(str);
    chunks.push(bytes);
    pos += bytes.length;
  }

  function markObjOffset() {
    offsets.push(pos);
  }

  pushStr(header);

  // 1: catalog
  markObjOffset();
  pushStr('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  // 2: pages
  markObjOffset();
  pushStr('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

  // 3: page
  markObjOffset();
  pushStr('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n');

  // 4: contents
  markObjOffset();
  pushStr(`4 0 obj\n<< /Length ${contentStreamBytes.length} >>\nstream\n`);
  chunks.push(contentStreamBytes);
  pos += contentStreamBytes.length;
  pushStr('\nendstream\nendobj\n');

  // 5: font
  markObjOffset();
  pushStr('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');

  // xref
  const xrefStart = pos;
  pushStr('xref\n0 6\n');
  pushStr('0000000000 65535 f \n');
  for (let i = 1; i <= 5; i++) {
    const off = String(offsets[i]).padStart(10, '0');
    pushStr(`${off} 00000 n \n`);
  }

  pushStr('trailer\n<< /Size 6 /Root 1 0 R >>\n');
  pushStr('startxref\n');
  pushStr(String(xrefStart) + '\n');
  pushStr('%%EOF\n');

  return { bytes: new Uint8Array(chunks.reduce((acc, b) => acc + b.length, 0)), chunks, filename };
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadSampleMediationAgreement() {
  const lines = [
    'This sample is for general informational purposes only.',
    'It is not legal advice. Consult a qualified professional for your situation.',
    '',
    'SAMPLE MEDIATION SETTLEMENT AGREEMENT',
    '',
    'This Agreement is made on: ____________ (Date)',
    'Between:',
    'Party A: _______________________________________________',
    'Address: ________________________________________________',
    'And',
    'Party B: _______________________________________________',
    'Address: ________________________________________________',
    '',
    '1. Background / Dispute',
    'The Parties have a dispute regarding: ______________________',
    '',
    '2. Settlement Terms',
    '(a) ______________________________________________________',
    '(b) ______________________________________________________',
    '(c) ______________________________________________________',
    '',
    '3. Payment / Performance (if applicable)',
    'Amount: ____________  Due date(s): ________________________',
    'Mode of payment / performance: ____________________________',
    '',
    '4. Confidentiality',
    'The Parties agree to keep mediation communications confidential,',
    'subject to applicable law and any mandatory disclosures.',
    '',
    '5. Full and Final Settlement',
    'Upon performance of the above terms, the Parties confirm that',
    'the dispute stands resolved fully and finally as recorded herein.',
    '',
    '6. Voluntary Agreement',
    'Each Party confirms they have read and understood this Agreement',
    'and sign it voluntarily.',
    '',
    'Signatures',
    'Party A Signature: ____________________  Date: ____________',
    'Party B Signature: ____________________  Date: ____________',
    'Mediator (optional): ___________________  Date: ____________'
  ];

  const { chunks } = buildSimplePdfBytes(lines, {
    title: 'Sample Mediation Agreement (Template)',
    filename: 'Sample-Mediation-Agreement.pdf'
  });

  const blob = new Blob(chunks, { type: 'application/pdf' });
  downloadBlob(blob, 'Sample-Mediation-Agreement.pdf');
}

function downloadMediationActMarathiSummary() {
  const lines = [
    'Note: This is a Marathi summary placeholder.',
    'Your browser PDF font may not support Marathi script without embedding.',
    'Use the official (EN/HI) government PDF link for the full Act.',
    '',
    'Mediation Act, 2023 — Marathi Summary (outline)',
    '',
    'Purpose: Promote mediation and make dispute resolution faster and accessible.',
    'Key ideas: confidentiality, voluntary participation, neutral mediator, enforceable settlement.',
    'Online mediation: allows conducting mediation through online modes where appropriate.',
    '',
    'This document is informational and not legal advice.'
  ];

  const { chunks } = buildSimplePdfBytes(lines, {
    title: 'Mediation Act, 2023 (Marathi Summary)',
    filename: 'Mediation-Act-2023-Marathi-Summary.pdf'
  });

  const blob = new Blob(chunks, { type: 'application/pdf' });
  downloadBlob(blob, 'Mediation-Act-2023-Marathi-Summary.pdf');
}

// Init
observeReveals();
