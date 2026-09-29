/**
 * Configuración de Firebase de esta web (proyecto youwebit-platform).
 *
 * Los valores de src/firebase.config.json son identificadores públicos (no
 * secretos): salen de `terraform output -json sites` en youwebit-platform.
 * En pruebas y desarrollo local se puede apuntar al emulador de Firestore con
 * PUBLIC_FIRESTORE_EMULATOR_HOST=127.0.0.1:8085 al compilar; entonces no se
 * usa App Check.
 */
import config from '../firebase.config.json';

export const emulatorHost: string = import.meta.env.PUBLIC_FIRESTORE_EMULATOR_HOST ?? '';
export const appCheckDebugToken: string = import.meta.env.PUBLIC_APPCHECK_DEBUG_TOKEN ?? '';

export const firebaseConfig = emulatorHost
  ? { projectId: 'demo-youwebit', apiKey: 'demo', appId: 'demo', authDomain: '', recaptchaSiteKey: '', quizUrl: 'http://127.0.0.1:8098' }
  : config;

/** URL base de la función del juego (<quizUrl>/<siteId>/submit). */
export const quizUrl: string = (firebaseConfig.quizUrl ?? '').replace(/\/+$/, '');

/** true cuando el formulario propio puede guardar respuestas. */
export const firebaseConfigured: boolean =
  Boolean(emulatorHost) || Boolean(config.projectId && config.apiKey && config.appId && config.recaptchaSiteKey);

/** true cuando el juego puede puntuar (Firebase configurado + URL de la función). */
export const quizConfigured: boolean = firebaseConfigured && Boolean(quizUrl);
