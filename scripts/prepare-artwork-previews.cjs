const { createHash } = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const sourceDirectory = path.join(root, "public/assets/images/media");
const outputDirectory = path.join(root, "public/assets/generated/imagery");
const manifestPath = path.join(root, "src/generated/artwork-previews.json");

async function main() {
  await fs.mkdir(outputDirectory, { recursive: true });
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  const files = (await fs.readdir(sourceDirectory))
    .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
    .sort();
  const manifest = {};
  let originalBytes = 0;
  let previewBytes = 0;
  let originalPixels = 0;
  let previewPixels = 0;

  for (const file of files) {
    const input = await fs.readFile(path.join(sourceDirectory, file));
    const metadata = await sharp(input).metadata();
    // Browser images honor EXIF orientation; reserve the same oriented shape.
    const { width, height } = metadata.autoOrient ?? metadata;
    const hash = createHash("sha256")
      .update("gallery-v1")
      .update(input)
      .digest("hex")
      .slice(0, 12);
    const name = path.parse(file).name;
    const variants = [];
    for (const size of [
      ...new Set([480, 960, 1280].map((value) => Math.min(value, width))),
    ]) {
      const filename = `${name}-${hash}-${size}.webp`;
      const output = path.join(outputDirectory, filename);
      try {
        await fs.access(output);
      } catch {
        await sharp(input)
          .rotate()
          .resize({ width: size, withoutEnlargement: true })
          .webp({ quality: 84 })
          .toFile(output);
      }
      variants.push({
        src: `/assets/generated/imagery/${filename}`,
        width: size,
        output,
      });
    }
    const preview = variants.find(
      (variant) => variant.width >= Math.min(width, 960),
    );
    manifest[`/assets/images/media/${file}`] = {
      src: preview.src,
      srcSet: variants
        .map((variant) => `${variant.src} ${variant.width}w`)
        .join(", "),
      width,
      height,
    };
    originalBytes += input.length;
    previewBytes += (await fs.stat(preview.output)).size;
    originalPixels += width * height;
    previewPixels +=
      preview.width * Math.round((height / width) * preview.width);
  }
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(
    `Artwork previews: ${files.length} images, ${(originalBytes / 1048576).toFixed(1)} → ${(previewBytes / 1048576).toFixed(1)} MB at 960px; ${Math.round((1 - previewPixels / originalPixels) * 100)}% fewer decoded pixels.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
