let tts;

let input;
let button;
let Inputtext;

async function preload() {

  try {
    const module = await import("https://cdn.jsdelivr.net/npm/kokoro-js@1.2.0/+esm");
    KokoroTTS = module.KokoroTTS;
  } catch (error) {
    console.error("Failed to load module:", error);
  }
  tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { dtype: "q8" });
}

let mCanvas;
let mSound;
function setup() {
  mCanvas = createCanvas(windowWidth, windowHeight);
  mSound = new p5.SoundFile();

  input = createElement('textarea', 'Write text you want to generate as audio');
  input.style('white-space', 'pre-wrap');
  input.position(550, 100);
  input.size(500,300);

  button =createButton('Generate Audio');
  button.position(550,windowHeight / 2);
  button.mousePressed(generateAudio);
  button.style('background-color', 'rgb(83, 124, 244)');
  button.style('color', 'white');
 button.size(500,50);
}


let modelReady;
function draw() {
  background(220);

  modelReady = typeof tts !== "undefined";
  if (!modelReady) {
    text("Loading !", 20, 40);
  }
}


async function generateAudio() {
  if (!modelReady) return;

  let Inputtext=input.value();


    console.log("generating");
    let speech = await tts.generate(Inputtext, {
      voice: "af_bella",
    });

    console.log(speech);

    mSound.setBuffer([speech.audio]);
    mSound.rate(speech.sampling_rate / mSound.buffer.sampleRate);
    mSound.play();
  
}
