export function base64ToArrayBuffer(base64) {
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  } catch {
    // If it's not valid base64, it might be text (GLTF)
    return base64;
  }
}
