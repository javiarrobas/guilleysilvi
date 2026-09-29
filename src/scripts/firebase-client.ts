/**
 * Cliente de Firebase compartido por el formulario de confirmación, el juego y el
 * ranking: una sola app, App Check (salvo en modo emulador) y Firestore Lite.
 */
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getToken, initializeAppCheck, ReCaptchaEnterpriseProvider, type AppCheck } from 'firebase/app-check';
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore/lite';
import { appCheckDebugToken, emulatorHost, firebaseConfig } from '@/lib/firebase';

declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean;
  }
}

let app: FirebaseApp | undefined;
let appCheck: AppCheck | undefined;
let firestore: Firestore | undefined;

function getApp(): FirebaseApp {
  if (!app) {
    app = initializeApp({
      projectId: firebaseConfig.projectId,
      apiKey: firebaseConfig.apiKey,
      appId: firebaseConfig.appId,
      authDomain: firebaseConfig.authDomain || undefined,
    });
    if (!emulatorHost) {
      if (appCheckDebugToken) window.FIREBASE_APPCHECK_DEBUG_TOKEN = appCheckDebugToken;
      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(firebaseConfig.recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true,
      });
    }
  }
  return app;
}

/** Firestore Lite, conectado al emulador cuando la web se compiló para pruebas. */
export function getDb(): Firestore {
  if (!firestore) {
    firestore = getFirestore(getApp());
    if (emulatorHost) {
      const [host, port] = emulatorHost.split(':');
      connectFirestoreEmulator(firestore, host, Number(port));
    }
  }
  return firestore;
}

/** Token de App Check para llamar a las funciones de la plataforma (vacío en modo emulador). */
export async function getAppCheckToken(): Promise<string> {
  getApp();
  if (!appCheck) return '';
  return (await getToken(appCheck, false)).token;
}

/** sha256 hex de un email normalizado (minúsculas, sin espacios). */
export async function emailHash(email: string): Promise<string> {
  const bytes = new TextEncoder().encode(email.trim().toLowerCase());
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}
