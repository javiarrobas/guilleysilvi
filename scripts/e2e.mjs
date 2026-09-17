/**
 * Lanza las pruebas end-to-end dejando el terreno limpio: mata los procesos que
 * hayan quedado escuchando en los puertos del emulador de Firestore (8085) y del
 * servidor estático (4173) antes y después. El emulador (Java) sobrevive a veces a
 * la ejecución anterior y, con reglas antiguas cargadas, hace fallar pruebas que
 * en realidad pasan.
 *
 *   npm run test:e2e -- [argumentos de playwright]
 */
import { execFileSync, spawnSync } from 'node:child_process';

const PORTS = [8085, 4173];

function killListeners() {
  for (const port of PORTS) {
    let pids = '';
    try {
      pids = execFileSync('lsof', ['-tnP', `-iTCP:${port}`, '-sTCP:LISTEN'], { encoding: 'utf8' });
    } catch {
      continue; // nadie escucha
    }
    for (const pid of pids.split('\n').filter(Boolean)) {
      try {
        process.kill(Number(pid), 'SIGKILL');
        console.log(`e2e: matado el proceso ${pid} que escuchaba en ${port}`);
      } catch {
        /* ya no existe */
      }
    }
  }
}

killListeners();
const result = spawnSync('npx', ['playwright', 'test', ...process.argv.slice(2)], { stdio: 'inherit' });
killListeners();
process.exit(result.status ?? 1);
