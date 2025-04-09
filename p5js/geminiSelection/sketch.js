let mImg =null;
let mCaption = "";
let startX, startY, endX, endY;
let imgX =20;
let imgY = 20;
let imgWidth= 500;
let imgHeight =300;
let MouseSelecting = false;
let selectedImg;
let fileInput;
let dropdown;
let flagbutton;
//let audio;


// let scroll=0;

// function preload() {
//   mImg = loadImage("../../imgs/MathTest13.png"); 
// }

function setup() {
  createCanvas(windowWidth, 1500);
  textSize(16);
  textWrap(WORD);

  fileInput =createFileInput(handleImage);
  fileInput.position(20, 360);

  captionX = 20;
  captionY = imgHeight + 100;
  captionW = width - 40;

 //flagbutton =createButton("Report Incorrect Explanation");
  //flagbutton.position(550,100);// change position +size after


  // audio =createButton("Listen to the Explanations");
  // audio.position(550,140);// change position +size after

  dropdown = createSelect();
  //let dropdownWidth = 300; 
  let dropdownHeight = 50;

  let dropdownX =20;
  let dropdownY =(windowHeight - dropdownHeight)/ 2;
  dropdown.position(dropdownX, dropdownY-30);
  //dropdown.option('Please Select a topic');
  dropdown.option('Analytical Geomtry-Ellipses');
  dropdown.option('Analytical Geomtry-Whispering Chambers');
  dropdown.option('Analytical Geomtry-Hyperbola');
  dropdown.option('Analytical Geomtry-Parabola');
  dropdown.option('Analytical Geomtry-Degenerate Conics');

}

function draw() {
  background(220);

  if (mImg) {
    image(mImg, imgX, imgY, imgWidth, imgHeight);
  }

  if (MouseSelecting) {
    noFill();
    stroke(255, 0, 0);
    rect(startX, startY, mouseX - startX,  mouseY - startY);
  }

  if (selectedImg) {
    if (selectedImg) {
      let fixedW = 500;
      let fixedH = 300;
      let xOffset = width - fixedW-20;  
      let yOffset = 20;                   
      image(selectedImg, xOffset, yOffset, fixedW, fixedH);
    }
  }

  fill(0);
  noStroke();
  text("Please select which part of the image you want explained:" + mCaption, captionX, captionY+30, captionW);
}


function handleImage(file) {
  if (file.type){
    if (file.type === 'image') {
      mImg = loadImage(file.data, () => {
        selectedImg = null;    
        mCaption = "";         
      });
    } else {
     mImg=null;
    }

  }
}
 
function mousePressed() {
  if (mouseX > imgX && mouseX < imgX + imgWidth && mouseY > imgY && mouseY < imgY + imgHeight) {
    startX=mouseX;
    startY =mouseY;
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
      let scaleX = mImg.width/500;
    let scaleY = mImg.height/300;

    let imgSelX = (x - imgX) * scaleX;
    let imgSelY = (y - imgY) * scaleY;
    let imgSelW = w * scaleX;
    let imgSelH = h * scaleY;

    selectedImg = mImg.get(imgSelX, imgSelY, imgSelW, imgSelH);
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

  let userContext = dropdown.value(); 


    let prompt = {parts: [
      {
        text: `System Instruction: You are a helpful and concise math tutor.You are helping a student studying Analytical Geometry. 
  They uploaded a math graph related to the topic: "${userContext}".
  
  First, analyze the entire image and explain what type of mathematical concept or conic section is generally being illustrated.`
      },
      { 
        inline_data: {
          mime_type: "image/jpeg",
          data: encodeImg(mImg)
        }
      },
      {
        text: `Now, the student has selected a specific region from this image for further explanation. Use superscripts (e.g., x², y³) instead of caret notation (like x^2 or y^3).
  Please do the following:
  1. Describe what this selected region shows, using correct mathematical vocabulary.
  2. Provide a step-by-step explanation of all the key points shown in the selected region and if applicable, state the standard form of the equation for this conic section or any other relevant formula. Don't calculate any unknown parameters, just give out the explanations on how to get there.`
      },
      { 
        inline_data: {
          mime_type: "image/jpeg",
          data: encodeImg(p5img)
        }
      },
      {
        text: `Now, based upon the text generated for the specific region, give these options for the students.
    - Option 1: Calculate and explain the general equation.

    - Option 2: Input a question you want to ask? 
         `
      },
    ]
  };
   
  mCaption = await generateContent(prompt); 

}


// //parts: [
//   { 
//     text: `The student selected: "${userContext}".

// Describe this selected part of the image and then provide a step-by-step explanation. Afterwards offer a conceptual question follow up.` 
//   },
//   { 
//     inline_data: {
//       mime_type: "image/jpeg",
//       data: encodeImg(p5img)
//     }
//   }
// ]
// };


//   let prompt = {
//     parts: [
//       {
//         text: `The student described this image as: "${userContext}". 

// Describe this selected part of the image, then provide a step-by-step explanation based on that context. 
// Afterwards, ask a conceptual follow-up question related to the image and its topic.`
//       },
//       {
//         inline_data: {
//           mime_type: "image/jpeg",
//           data: encodeImg(p5img)
//         }
//       }
//     ]
//   };

  //mCaption = await generateContent(prompt);



