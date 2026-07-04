const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

menuToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function calculatePayment() {
  const price = Number(document.getElementById('price').value) || 0;
  const down = Number(document.getElementById('down').value) || 0;
  const rate = (Number(document.getElementById('rate').value) || 0) / 100 / 12;
  const years = Number(document.getElementById('years').value) || 30;
  const principal = Math.max(price - down, 0);
  const months = years * 12;
  let payment = principal / months;
  if (rate > 0) {
    payment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
  }
  document.getElementById('payment').textContent = `${formatMoney(payment)}/mo`;
}

document.getElementById('calculate')?.addEventListener('click', calculatePayment);
calculatePayment();

const form = document.getElementById('leadForm');
const status = document.getElementById('formStatus');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.textContent = 'Sending your request...';
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Request failed');

    status.textContent = 'Thank you. Your request was sent successfully.';
    form.reset();
  } catch (error) {
    status.textContent = 'Something went wrong. Please call Gus at (786) 368-4035.';
  } finally {
    submitButton.disabled = false;
  }
});
