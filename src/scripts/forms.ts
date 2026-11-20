/**
 * Progressive behaviour for the waitlist and contact forms.
 *
 * Markup contract: a `[data-form-wrap]` element holding a `form[data-form]`
 * and a hidden `[data-form-done]` thank-you block with a `[data-form-reset]`
 * button. Inside the form, `[data-form-error]` is shown when sending fails and
 * `[data-choice]` groups mirror their pressed chip into a hidden input.
 *
 * Submissions POST to PUBLIC_FORM_ENDPOINT. While that is not configured
 * nothing is sent and the thank-you state is shown straight away.
 */
const endpoint: string | undefined = import.meta.env.PUBLIC_FORM_ENDPOINT || undefined;

document.querySelectorAll<HTMLElement>('[data-choice]').forEach((group) => {
  const input = group.querySelector<HTMLInputElement>('input[type="hidden"]');
  const buttons = group.querySelectorAll<HTMLButtonElement>('button');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      if (input) input.value = button.dataset.value ?? '';
    });
  });
});

document.querySelectorAll<HTMLElement>('[data-form-wrap]').forEach((wrap) => {
  const form = wrap.querySelector<HTMLFormElement>('form[data-form]');
  const done = wrap.querySelector<HTMLElement>('[data-form-done]');
  if (!form || !done) return;
  const error = form.querySelector<HTMLElement>('[data-form-error]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (error) error.hidden = true;

    if (endpoint) {
      const body = new FormData(form);
      body.set('form', form.dataset.form ?? '');
      if (submit) submit.disabled = true;
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body,
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`);
      } catch {
        if (error) error.hidden = false;
        return;
      } finally {
        if (submit) submit.disabled = false;
      }
    }

    form.hidden = true;
    done.hidden = false;
    done.focus();
  });

  wrap.querySelector('[data-form-reset]')?.addEventListener('click', () => {
    form.reset();
    form
      .querySelectorAll<HTMLButtonElement>('[data-choice] button')
      .forEach((b) => b.setAttribute('aria-pressed', String(b.hasAttribute('data-default'))));
    done.hidden = true;
    form.hidden = false;
  });
});
