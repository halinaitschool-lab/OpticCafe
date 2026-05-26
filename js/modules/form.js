/**
 * Contact form handler with client-side validation.
 * @param {Document} doc
 */
export function initContactForm(doc = document) {
  const form = doc.querySelector('.contact__form, .contact-form, #email-form');
  if (!form) return;

  const success = doc.querySelector('.contact__success, .w-form-done');
  const failure = doc.querySelector('.contact__error, .w-form-fail');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get('Name') || '').trim();
    const email = String(formData.get('Email') || '').trim();
    const message = String(formData.get('Message') || '').trim();

    if (!name || !email || !message) {
      showState(success, failure, 'error');
      const firstInvalid = !name
        ? form.querySelector('#Name')
        : !email
          ? form.querySelector('#Email')
          : form.querySelector('#Message');
      firstInvalid?.focus();
      return;
    }

    const subject = encodeURIComponent(`Wiadomość ze strony Optic Café — ${name}`);
    const body = encodeURIComponent(`Imię: ${name}\nE-mail: ${email}\n\n${message}`);
    window.location.href = `mailto:maestro@awm.pl?subject=${subject}&body=${body}`;
    showState(success, failure, 'success');
    form.reset();
  });
}

/**
 * @param {Element | null} success
 * @param {Element | null} failure
 * @param {'success' | 'error'} state
 */
function showState(success, failure, state) {
  if (success) success.style.display = state === 'success' ? 'block' : 'none';
  if (failure) failure.style.display = state === 'error' ? 'block' : 'none';
}
