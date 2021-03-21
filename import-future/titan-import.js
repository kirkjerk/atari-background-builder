const grid = Array();


let input;
let img;



function setup() {
  createCanvas(400,400).parent('canvasParent');
  
  input = createFileInput(handleFile);
  
}


function draw() {
  if (img) {
    image(img, 0, 0, 48);
    console.log(image.width);
  }
  
}



function handleFile(file) {
  print(file);
  if (file.type === 'image') {
    img = createImg(file.data, '');
    
    img.hide();
  } else {
    img = null;
  }
}