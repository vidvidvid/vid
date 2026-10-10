// Keep the locally served PDF worker matched to the installed renderer version.
const { copyFileSync } = require("node:fs");
const { join } = require("node:path");

copyFileSync(
  require.resolve("pdfjs-dist/build/pdf.worker.min.mjs"),
  join(__dirname, "..", "public", "pdf.worker.min.mjs"),
);
