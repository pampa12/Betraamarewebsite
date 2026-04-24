document.addEventListener('DOMContentLoaded', () => {
  const onScreen = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  onScreen.forEach((el) => observer.observe(el));

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const fallbackPath = 'assets/photos/fallback.svg';
  document.querySelectorAll('img.photo-fallback').forEach((img) => {
    const desiredPhoto = img.dataset.photo;

    const showFallback = () => {
      if (img.src.includes(fallbackPath)) return;
      img.src = fallbackPath;
    };

    img.addEventListener('error', showFallback);

    if (!desiredPhoto) {
      if (img.complete && img.naturalWidth === 0) showFallback();
      return;
    }

    const probe = new Image();
    probe.onload = () => { img.src = desiredPhoto; };
    probe.onerror = showFallback;
    probe.src = desiredPhoto;
  });

  const form = document.querySelector('#contact-form');
  if (!form) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const fields = {
    name: form.querySelector('#name'),
    email: form.querySelector('#email'),
    message: form.querySelector('#message')
  };

  const markInvalid = (el) => el.classList.add('field-error');
  const clearInvalid = (el) => el.classList.remove('field-error');

  Object.values(fields).forEach((field) => {
    field.addEventListener('input', () => clearInvalid(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let firstInvalid = null;

    if (!fields.name.value.trim()) {
      markInvalid(fields.name);
      firstInvalid = firstInvalid || fields.name;
    }

    if (!emailRegex.test(fields.email.value.trim())) {
      markInvalid(fields.email);
      firstInvalid = firstInvalid || fields.email;
    }

    if (!fields.message.value.trim()) {
      markInvalid(fields.message);
      firstInvalid = firstInvalid || fields.message;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      alert('Please complete all required fields with a valid email.');
      return;
    }

    alert('Thanks! Your message has been prepared for Betra Amare.');
    form.reset();
  });
});
