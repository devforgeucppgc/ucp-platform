export function fileToDataUrl(file, maxMB = 50) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    const mb = file.size / (1024 * 1024);
    if (mb > maxMB) return reject(new Error(`File too large for localStorage demo (max ${maxMB}MB)`));

    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}