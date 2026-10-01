// Preflight for the manual scripts (photos, og, quiz:publish): a clear message instead of
// a SyntaxError when the shell's default Node (v12 on this Mac) is active. CommonJS on
// purpose, so that even very old Node versions can parse and run it.
var major = parseInt(process.versions.node.split('.')[0], 10);
if (major < 22) {
  console.error('\nThis project needs Node 22 (you are on ' + process.version + ').\nRun:  nvm use\n(.nvmrc selects the right version; `nvm install 22` the first time)\n');
  process.exit(1);
}
