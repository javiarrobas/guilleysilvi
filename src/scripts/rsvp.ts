/**
 * Formulario de confirmación: lógica de cliente.
 *  - muestra u oculta secciones según las respuestas (asistencia, acompañante, niños…)
 *  - valida con los mensajes del idioma de la página
 *  - guarda la respuesta en Firestore (sites/<siteId>/rsvps) sin ningún inicio de sesión
 *  - al salir del campo de email, avisa si ese email ya respondió (se puede reenviar)
 *
 * Los invitados no pueden leer respuestas. Para el aviso se guarda, junto a cada
 * respuesta, un documento sites/<siteId>/emails/<sha256(email)> con la fecha; solo
 * ese documento es consultable, y solo por su hash.
 */
import { collection, doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore/lite';
import { isLocale, type Locale } from '@/i18n';
import { emailHash, getDb } from './firebase-client';

type Messages = {
  required: string;
  invalidEmail: string;
  fixErrors: string;
  alreadyAnswered: string;
  child: string;
  sending: string;
  submit: string;
};

type Rsvp = {
  locale: Locale;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  attending: boolean;
  plusOne?: boolean;
  plusOneFirstName?: string;
  plusOneLastName?: string;
  plusOneDiet?: string;
  diet?: string;
  busOut?: boolean;
  busBack?: boolean;
  children?: { name: string; age: number; diet: string }[];
  preboda?: 'yes' | 'no' | 'maybe';
  song?: string;
  artist?: string;
  comments?: string;
  createdAt: unknown;
};

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;


const text = (form: HTMLFormElement, name: string, max: number) => {
  const el = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | RadioNodeList | null;
  const value = el && 'value' in el ? String(el.value) : '';
  return value.trim().slice(0, max);
};
const radio = (form: HTMLFormElement, name: string) => {
  const el = form.elements.namedItem(name);
  return el instanceof RadioNodeList ? el.value : '';
};
const bool = (form: HTMLFormElement, name: string) => radio(form, name) === 'yes';

/** Datos del formulario → documento con la forma exacta que exigen las reglas de Firestore. */
export function collect(form: HTMLFormElement, locale: Locale): Rsvp {
  const attending = bool(form, 'attending');
  const data: Rsvp = {
    locale,
    firstName: text(form, 'firstName', 80),
    lastName: text(form, 'lastName', 120),
    email: text(form, 'email', 160),
    attending,
    createdAt: serverTimestamp(),
  };
  const phone = text(form, 'phone', 40);
  if (phone) data.phone = phone;
  if (!attending) return data;

  data.plusOne = bool(form, 'plusOne');
  if (data.plusOne) {
    data.plusOneFirstName = text(form, 'plusOneFirstName', 80);
    data.plusOneLastName = text(form, 'plusOneLastName', 120);
    const plusOneDiet = text(form, 'plusOneDiet', 500);
    if (plusOneDiet) data.plusOneDiet = plusOneDiet;
  }
  if (bool(form, 'hasDiet')) data.diet = text(form, 'diet', 500);
  data.busOut = bool(form, 'busOut');
  data.busBack = bool(form, 'busBack');
  if (bool(form, 'hasChildren')) {
    const rows = Array.from(form.querySelectorAll<HTMLElement>('[data-child-row]:not([hidden])'));
    data.children = rows.slice(0, 10).map((row) => ({
      name: (row.querySelector<HTMLInputElement>('[data-child="name"]')?.value ?? '').trim().slice(0, 80),
      age: Math.max(0, Math.min(17, Number(row.querySelector<HTMLInputElement>('[data-child="age"]')?.value) || 0)),
      diet: (row.querySelector<HTMLInputElement>('[data-child="diet"]')?.value ?? '').trim().slice(0, 300),
    }));
  }
  const preboda = radio(form, 'preboda');
  if (preboda === 'yes' || preboda === 'no' || preboda === 'maybe') data.preboda = preboda;
  const song = text(form, 'song', 120);
  if (song) data.song = song;
  const artist = text(form, 'artist', 120);
  if (artist) data.artist = artist;
  const comments = text(form, 'comments', 1000);
  if (comments) data.comments = comments;
  return data;
}

export function setupRsvpForm(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('form[data-rsvp-form]');
  if (!form) return;
  const messages = JSON.parse(root.dataset.messages ?? '{}') as Messages;
  const locale: Locale = isLocale(root.dataset.locale) ? root.dataset.locale : 'es';
  const siteId = root.dataset.site ?? '';

  const panels = {
    form: root.querySelector<HTMLElement>('[data-panel="form"]')!,
    success: root.querySelector<HTMLElement>('[data-panel="success"]')!,
    successNo: root.querySelector<HTMLElement>('[data-panel="success-no"]')!,
    error: root.querySelector<HTMLElement>('[data-panel="error"]')!,
  };
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const formError = form.querySelector<HTMLElement>('[data-form-error]')!;

  const show = (panel: keyof typeof panels) => {
    Object.entries(panels).forEach(([key, el]) => (el.hidden = key !== panel));
    panels[panel].focus?.();
    panels[panel].scrollIntoView?.({ block: 'start', behavior: 'smooth' });
  };
  // --- Aviso de respuesta anterior: al salir del campo de email ---
  const emailField = form.querySelector<HTMLInputElement>('#email');
  const emailHint = form.querySelector<HTMLElement>('[data-email-hint]');
  let lastChecked = '';
  const checkEmail = async () => {
    if (!emailField || !emailHint) return;
    const email = emailField.value.trim();
    if (!EMAIL.test(email)) {
      emailHint.hidden = true;
      return;
    }
    const key = email.toLowerCase();
    if (key === lastChecked) return;
    lastChecked = key;
    try {
      const snap = await getDoc(doc(getDb(), `sites/${siteId}/emails/${await emailHash(key)}`));
      if (emailField.value.trim().toLowerCase() !== key) return; // el campo cambió mientras tanto
      const at = snap.exists() ? (snap.get('lastAt') as { toDate?: () => Date } | undefined) : undefined;
      if (at?.toDate) {
        const date = at.toDate().toLocaleDateString(locale, { day: 'numeric', month: 'long' });
        emailHint.textContent = messages.alreadyAnswered.replace('{date}', date);
        emailHint.hidden = false;
      } else {
        emailHint.hidden = true;
      }
    } catch (error) {
      console.warn('rsvp: no se pudo comprobar el email', error);
      emailHint.hidden = true;
    }
  };
  emailField?.addEventListener('blur', () => void checkEmail());
  emailField?.addEventListener('input', () => {
    if (emailField.value.trim().toLowerCase() !== lastChecked && emailHint) emailHint.hidden = true;
  });

  // --- Secciones condicionales: data-when="campo=valor" ---
  const conditionals = Array.from(form.querySelectorAll<HTMLElement>('[data-when]'));
  const refresh = () => {
    conditionals.forEach((section) => {
      const [name, expected] = (section.dataset.when ?? '').split('=');
      const parentVisible = !section.parentElement?.closest<HTMLElement>('[data-when]')?.hidden;
      const on = parentVisible && radio(form, name) === expected;
      section.hidden = !on;
      section.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select').forEach((field) => {
        field.disabled = !on;
      });
    });
    renderChildren();
  };

  // --- Filas de niños según el número elegido ---
  const childrenContainer = form.querySelector<HTMLElement>('[data-children]');
  const childTemplate = form.querySelector<HTMLTemplateElement>('template[data-child-template]');
  const renderChildren = () => {
    if (!childrenContainer || !childTemplate) return;
    const count = Number((form.elements.namedItem('childrenCount') as HTMLSelectElement | null)?.value) || 0;
    const rows = Array.from(childrenContainer.querySelectorAll<HTMLElement>('[data-child-row]'));
    for (let i = rows.length; i < count; i++) {
      const row = childTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
      row.querySelector('[data-child-title]')!.textContent = messages.child.replace('{n}', String(i + 1));
      row.querySelectorAll<HTMLElement>('[data-child]').forEach((field) => {
        const kind = field.dataset.child;
        const id = `child-${i + 1}-${kind}`;
        field.id = id;
        (field as HTMLInputElement).name = id;
        field.closest('.field')?.querySelector('label')?.setAttribute('for', id);
      });
      childrenContainer.appendChild(row);
    }
    childrenContainer.querySelectorAll<HTMLElement>('[data-child-row]').forEach((row, i) => {
      const on = i < count && !childrenContainer.closest<HTMLElement>('[data-when]')?.hidden;
      row.hidden = i >= count;
      row.querySelectorAll<HTMLInputElement>('input').forEach((field) => (field.disabled = !on));
    });
  };

  // Los errores de los campos de texto se limpian MIENTRAS se escribe (evento
  // input), nunca al salir del campo: si el mensaje desapareciera al perder el
  // foco, el contenido se desplazaría justo cuando el invitado está pulsando la
  // siguiente opción y ese toque se perdería (visto en las pruebas).
  form.addEventListener('input', (event) => {
    const target = event.target as HTMLElement;
    if (target.matches('input:not([type="radio"]), textarea')) clearError(target as HTMLInputElement);
  });
  form.addEventListener('change', (event) => {
    const target = event.target as HTMLElement;
    if (target.matches('input[type="radio"], select')) {
      refresh();
      clearError(target as HTMLInputElement);
    }
  });
  refresh();

  // --- Validación ---
  const setError = (field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, message: string) => {
    const wrapper = field.closest<HTMLElement>('.field, .choice');
    wrapper?.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');
    const slot = wrapper?.querySelector<HTMLElement>('[data-error]');
    if (slot) slot.textContent = message;
  };
  const clearError = (field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => {
    const wrapper = field.closest<HTMLElement>('.field, .choice');
    wrapper?.classList.remove('is-invalid');
    field.removeAttribute('aria-invalid');
    const slot = wrapper?.querySelector<HTMLElement>('[data-error]');
    if (slot) slot.textContent = '';
  };

  const validate = (): boolean => {
    type Field = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const fields = Array.from(form.querySelectorAll<Field>('input, textarea, select')).filter(
      (f) => !f.disabled && f.type !== 'hidden' && f.name !== 'website',
    );
    const invalid: Field[] = [];
    const seenRadios = new Set<string>();
    // Primero se limpian todos los errores: si se hiciera dentro del bucle, el
    // segundo radio de un grupo borraría la marca que acaba de poner el primero.
    fields.forEach(clearError);
    for (const field of fields) {
      let message = '';
      if (field.type === 'radio') {
        if (seenRadios.has(field.name)) continue;
        seenRadios.add(field.name);
        if (field.required && !radio(form, field.name)) message = messages.required;
      } else if (field.required && !field.value.trim()) {
        message = messages.required;
      } else if (field.type === 'email' && field.value.trim() && !EMAIL.test(field.value.trim())) {
        message = messages.invalidEmail;
      }
      if (message) {
        setError(field, message);
        invalid.push(field);
      }
    }
    const first = invalid[0];
    formError.textContent = first ? messages.fixErrors : '';
    formError.hidden = !first;
    first?.focus();
    return !first;
  };

  // --- Envío ---
  let lastData: Rsvp | null = null;
  const send = async (data: Rsvp) => {
    submit.disabled = true;
    submit.textContent = messages.sending;
    try {
      // Honeypot: un bot que rellena el campo oculto ve un "gracias" y no guarda nada.
      const honeypot = (form.elements.namedItem('website') as HTMLInputElement | null)?.value;
      if (!honeypot) {
        const firestore = getDb();
        const batch = writeBatch(firestore);
        batch.set(doc(collection(firestore, `sites/${siteId}/rsvps`)), data);
        batch.set(doc(firestore, `sites/${siteId}/emails/${await emailHash(data.email)}`), { lastAt: serverTimestamp() });
        await batch.commit();
      }
      lastChecked = ''; // la próxima vez que se escriba este email, el aviso será correcto
      show(data.attending ? 'success' : 'successNo');
    } catch (error) {
      console.error('rsvp: no se pudo guardar la respuesta', error);
      show('error');
    } finally {
      submit.disabled = false;
      submit.textContent = messages.submit;
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validate()) return;
    lastData = collect(form, locale);
    void send(lastData);
  });

  root.querySelector('[data-retry]')?.addEventListener('click', () => {
    if (lastData) void send({ ...lastData, createdAt: serverTimestamp() });
    else show('form');
  });
  root.querySelectorAll('[data-again]').forEach((button) =>
    button.addEventListener('click', () => {
      form.reset();
      refresh();
      show('form');
    }),
  );
}
