const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

async function main() {
  const publicDirectory = path.resolve(__dirname, "../public");
  const source = await fs.readFile(path.join(publicDirectory, "favicon.svg"));
  const sizes = [
    ["favicon-16x16.png", 16],
    ["favicon-32x32.png", 32],
    ["apple-touch-icon.png", 180],
    ["android-chrome-192x192.png", 192],
    ["android-chrome-512x512.png", 512],
  ];
  for (const [file, size] of sizes) {
    await sharp(source, { density: 384 })
      .resize(size, size)
      .png()
      .toFile(path.join(publicDirectory, file));
  }

  // ICO directory with PNG frames for the common browser / desktop sizes.
  const frames = [];
  for (const size of [16, 32, 48]) {
    frames.push({
      size,
      data: await sharp(source, { density: 384 })
        .resize(size, size)
        .png()
        .toBuffer(),
    });
  }
  const header = Buffer.alloc(6 + frames.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  let offset = header.length;
  frames.forEach(({ size, data }, index) => {
    const entry = 6 + index * 16;
    header[entry] = size;
    header[entry + 1] = size;
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  await fs.writeFile(
    path.join(publicDirectory, "favicon.ico"),
    Buffer.concat([header, ...frames.map(({ data }) => data)]),
  );
  console.log("Generated site icons from public/favicon.svg.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
