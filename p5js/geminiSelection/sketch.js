let mImg;
let mCaption = "";
let startX, startY, endX, endY;
let MouseSelecting = false;
let selectedImg;

function preload() {
  mImg = loadImage("../../imgs/MathTest8.png"); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(16);
  textWrap(WORD);
}

function draw() {
  background(220);
  image(mImg, 0, 0);

  if (MouseSelecting) {
    noFill();
    stroke(255, 0, 0);
    rect(startX, startY, mouseX - startX, mouseY - startY);
  }

  if (selectedImg) {
    image(selectedImg, mImg.width + 20, 20); 
  }

  fill(0);
  noStroke();
  text("Please select which part of the image you want explained:" + mCaption, 10, mImg.height + 30, width - 10);
}

function mousePressed() {
  if (mouseY < mImg.height) {
    startX = mouseX;
    startY = mouseY;
    MouseSelecting = true;
  }
}

function mouseReleased() {
  if (MouseSelecting) {
    MouseSelecting = false;
    endX = mouseX;
    endY = mouseY;

    let x = min(startX, endX);
    let y = min(startY, endY);
    let w = abs(endX - startX);
    let h = abs(endY - startY);

    if (w > 10 && h > 10) {
      selectedImg = mImg.get(x, y, w, h);

      Selection(selectedImg);
    } 
  }
}

function encodeImg(p5img) {
  let tempCanvas = createGraphics(p5img.width, p5img.height);
  tempCanvas.image(p5img, 0, 0);
  let imgURL = tempCanvas.canvas.toDataURL("image/jpeg");
  return imgURL.replace("data:image/jpeg;base64,", "");
}

async function Selection(p5img) {
  let prompt = {
    parts: [
      { text: "Describe this selected part of the image and then provide a step-by-step explanation. Afterwards offer a conceptual question follow up." },
      { inline_data: {
          mime_type: "image/jpeg",
          data: encodeImg(p5img)
        }}
    ]
  };

  mCaption = await generateContent(prompt); 
}

