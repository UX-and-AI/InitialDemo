let KokoroTTS;

async function loadModule() {
  try {
    const module = await import("https://cdn.jsdelivr.net/npm/kokoro-js@1.2.0/+esm");
    KokoroTTS = module.KokoroTTS;
  } catch (error) {
    console.error("Failed to load module:", error);
  }
}

loadModule();