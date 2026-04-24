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
  const extensionVariants = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG', 'WEBP'];

  const buildCandidates = (path) => {
    if (!path) return [];
    const dotIndex = path.lastIndexOf('.');
    const base = dotIndex > 0 ? path.slice(0, dotIndex) : path;
    const variants = extensionVariants.map((ext) => `${base}.${ext}`);

    // Legacy filename compatibility from earlier versions (ava-01 etc.)
    if (base.includes('betra-')) {
      const legacyBase = base.replace('betra-', 'ava-');
      variants.push(...extensionVariants.map((ext) => `${legacyBase}.${ext}`));
    }

    return [path, ...variants].filter((v, i, arr) => arr.indexOf(v) === i);
  };

  const preloadFirstAvailable = (paths, onSuccess, onFailure) => {
    if (!paths.length) {
      onFailure();
      return;
    }

    const tryPath = (idx) => {
      if (idx >= paths.length) {
        onFailure();
        return;
      }
      const probe = new Image();
      probe.onload = () => onSuccess(paths[idx]);
      probe.onerror = () => tryPath(idx + 1);
      probe.src = paths[idx];
    };

    tryPath(0);
  };

  document.querySelectorAll('img.photo-fallback').forEach((img) => {
    const desiredPhoto = img.dataset.photo;

    const showFallback = () => {
      if (img.src.includes(fallbackPath)) return;
      img.src = fallbackPath;
    };

    img.addEventListener('error', showFallback);

    const candidates = buildCandidates(desiredPhoto);
    if (!candidates.length) {
      if (img.complete && img.naturalWidth === 0) showFallback();
      return;
    }

    preloadFirstAvailable(
      candidates,
      (goodPath) => { img.src = goodPath; },
      showFallback
    );
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
