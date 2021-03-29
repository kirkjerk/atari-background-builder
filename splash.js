







let currentKernelMode;
let currentTool = 'draw';
let currentToolFunctions = toolFunctions[currentTool];
let currentInkMode = 'toggle';
let currentInkBoolean = false; 
let currentTVMode = 'ntsc';
let currentFGColor = '0E';
let currentBGColor = '00';
let currentColorPickerTarget='fg';
let currentFont;
let currentTextPixels = [];
let currentStartMouseX;
let currentStartMouseY;
let currentHotSpots = [];
let currentClipboard = [];

let currentUploadedImage;
let currentShowingUploadedImage;
let currentcurrentContrast = 128;
let currentInvert = false;

let W;
let H;
let PIXW;
let PIXH;


let yxGrid = Array();
let colorGrid = Array();


let sx,sy,ex,ey;



function preload(){
  // currentUploadedImage = loadImage('doublefine.png');
  // currentShowingUploadedImage = currentUploadedImage;
}

function setup() {
  setKernelMode('player48color');
  clearYXGrid();
  createCanvas(W * PIXW, H * PIXH).parent('canvasParent');
  makePicker();
  setFont('tiny3ishx4');
  //document.getElementById("picktext").click();


  createFileInput(loadImageFile).parent("fileButtonWrapper");


}

function clearYXGrid() {
  for (let y = 0; y < H; y++) {
    yxGrid[y] = Array();
  }
}


function loadImageFile(file){
  if (file.type === 'image') {
    currentUploadedImage = createImg(file.data, '');
    currentUploadedImage.hide();
    readImage();
    loop();

  } else {
    currentUploadedImage = null;
  }  
}


function setKernelMode(modestring){
  const mode = modes[modestring];
  W = mode.ATARI_WIDTH;
  H = mode.ATARI_STARTHEIGHT;
  PIXW = mode.SCREEN_WIDTH_PER;
  PIXH = mode.SCREEN_HEIGHT_PER;
  document.getElementById("height").value = H;
  document.getElementById("maxheight").innerHTML = mode.ATARI_MAXHEIGHT;
  
  document.getElementById("info").style.width = `${W*PIXW}px`;

  const colorToolElem = document.getElementById('colortool');
  colorToolElem.style.display = mode.MULTICOLOR ? 'block':'none';
  const colorPickShowElem = document.getElementById('hovercolorlabel');
  colorPickShowElem.style.display = mode.MULTICOLOR ? 'block':'none';

  currentKernelMode = mode;
  fillBlankColorGridWithDefault();
  loop();
}

function fillBlankColorGridWithDefault(){
  if(currentKernelMode.MULTICOLOR){
    for(let y = 0; y < H; y++){
      if(! colorGrid[y]){
        colorGrid[y] = currentFGColor;
      }
    }
  }
}

function getColorForRow(y,half){
  const alpha = half?'87':'';
  if(! currentKernelMode.MULTICOLOR || ! colorGrid[y]) {
    return `#${HUELUM2HEX[currentTVMode][currentFGColor]}${alpha}`;
  } else {
    return `#${HUELUM2HEX[currentTVMode][colorGrid[y]]}${alpha}`;
  }
}


function draw() {
  background(`#${HUELUM2HEX[currentTVMode][currentBGColor]}`);
  
  if(currentShowingUploadedImage){
      image(currentShowingUploadedImage, 0, 0, width, height);
  }
  
  noStroke();


for (let x = 0; x < W; x++) {
  for (let y = 0; y < H; y++) {
    fill(getColorForRow(y));
    if (yxGrid[y][x]) rect(x * PIXW, y * PIXH, PIXW, PIXH);
  }

}


strokeWeight(1);
let x = int(mouseX/PIXW); 
let y = int(mouseY/PIXH);
noFill();
stroke(getColorForRow(y));
if(currentToolFunctions.showHover()){
  rect(x * PIXW, y * PIXH, PIXW, PIXH);
}

// show hot spots for rect tool or line tool...
if(currentToolFunctions.showHotSpots()){
  //half tone current color or black
  fill(currentInkBoolean ? getColorForRow(y,true) : `#00000087`);
    currentHotSpots.map((spot)=>{
        rect(spot.x * PIXW, spot.y * PIXH, PIXW, PIXH); 
    });
}


if(currentKernelMode.MULTICOLOR && ! currentShowingUploadedImage){
  for(let y = 0; y < H; y++){
    noStroke();
    fill(getColorForRow(y));
    rect(0,y * PIXH,PIXW/4,PIXH);
  }
} 


noLoop();

}

function showHoverColor(){
  const gridY = int(mouseY / PIXH);
  const color = colorGrid[gridY];
  document.getElementById("hovercolor").innerHTML = color?color:'';
}



function mousePressed() {

const gridX = int(mouseX / PIXW);
const gridY = int(mouseY / PIXH);

if(currentInkMode == 'toggle') {
  currentInkBoolean = !getInYXGrid(gridX,gridY);
} else {
  currentInkBoolean = (currentInkMode == 'draw');
}
currentToolFunctions.mousePressed(gridX,gridY);
  loop();
}

function mouseDragged() {
  const sx = pmouseX;
  const sy = pmouseY;
  const ex = mouseX;
  const ey = mouseY;

  currentToolFunctions.mouseDragged(sx,sy,ex,ey);
  showHoverColor();
  loop();
}

function mouseMoved(){
  showHoverColor();
  const gridX = int(mouseX / PIXW);
  const gridY = int(mouseY / PIXH);
  currentToolFunctions.mouseMoved(gridX,gridY);
  loop();
}

function mouseReleased(){  
  currentToolFunctions.mouseReleased();
  loop();
}




const toolsWithSections = ["text","color","select"];

function setTool(what){
  currentTool = what;   
  currentToolFunctions = toolFunctions[what];

  toolsWithSections.forEach((tool) => {
    document.getElementById(`section${tool}`).style.display = 'none';
  });
  if(toolsWithSections.includes(what)) {
    document.getElementById(`section${what}`).style.display = 'block';
  }
  currentHotSpots = [];
  loop();

}

function setInkmode(what){
  currentInkMode = what;
  currentInkBoolean = (what == 'erase') ? false : true;
}



function setNewHeight(){
  const elem = document.getElementById('height');
  const newHeight = elem.value;
  

  elem.classList.remove("error");

  

  if(isNaN(newHeight) || newHeight < 0 || newHeight > currentKernelMode.ATARI_MAXHEIGHT){
    elem.classList.add("error");
  }

  const oldgrid = yxGrid;
  yxGrid = Array();
  let y;
  for (y = 0; y < min(H,newHeight); y++) {
    if(y < newHeight) yxGrid[y] = oldgrid[y];
  }
  for (; y < newHeight; y++) {
    yxGrid[y] = Array();
  }
  H = newHeight;
  resizeCanvas(W * PIXW, H * PIXH);

  fillBlankColorGridWithDefault();
}


function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.visibility = 'hidden';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


function makePicker(){
  
  const parentElem = document.getElementById('colorPickerHolder');

  const table = document.createElement("table");
  table.classList.add("colorpick");
  table.setAttribute("id","colorTable");
  table.style.visibility = "hidden";
  
  table.innerHTML = '<tr><td  colspan="8" onclick="closeAtariColorPicker()">X</td></tr>';

  
  for(let lum = 0; lum < 16; lum++){
    const tr  = document.createElement("tr");
    for(let hue = 0; hue < 16; hue+=2) {
      
      const atariKey = `${lum.toString(16)}${hue.toString(16)}`.toUpperCase();
        const hexColor = `#${HUELUM2HEX[currentTVMode][atariKey]}`;
        
        const td = document.createElement("td");
        td.classList.add((textClassForHexBg(hexColor)));
        td.innerHTML = atariKey;
        td.setAttribute('bgcolor',hexColor);
        td.onclick = () =>{
          clickAtariColor(atariKey);
        };
        tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  parentElem.innerHTML = '';
  parentElem.appendChild(table);
  
}

function textClassForHexBg(hexColor){
  const{r,g,b} = hexToRgb(hexColor);
  return (r+g+b) < 420 ? 'light':'dark';
}


// thanks https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}


function openAtariColorPicker(which){
  currentColorPickerTarget = which;
  document.getElementById('colorTable').style.visibility = "visible";
}
function closeAtariColorPicker(){
  document.getElementById('colorTable').style.visibility = "hidden";
}
function clickAtariColor(atariKey){
  document.getElementById('colorTable').style.visibility = "hidden";
  if(currentColorPickerTarget == 'fg') {
    setFGColor(atariKey);
    if(currentKernelMode.MULTICOLOR) {
      document.getElementById("colortool").click();
    }
  }
  if(currentColorPickerTarget == 'bg') setBGColor(atariKey);
  
}


function setTVMode(mode){
  currentTVMode = mode;
  makePicker();
  useCurrentFGColor();
  useCurrentBGColor();
}
function setFGColor(atariKey){
  currentFGColor = atariKey;
  useCurrentFGColor();
}
function setBGColor(atariKey){
  currentBGColor = atariKey;
  useCurrentBGColor();
}


function useCurrentFGColor(){
  const elem = document.getElementById('currentFG');
  showFGorBGColor(elem,currentFGColor);
}
function useCurrentBGColor(){
  const elem = document.getElementById('currentBG');
  showFGorBGColor(elem,currentBGColor);

}
function showFGorBGColor(elem, atariColor){
  elem.innerHTML = currentFGColor;
  const hexColor = `#${HUELUM2HEX[currentTVMode][atariColor]}`;
  elem.style.backgroundColor = hexColor;
  elem.classList.remove("light");
  elem.classList.remove("dark");
  elem.classList.add(textClassForHexBg(hexColor));
  loop();
}


function setFont(fontname) {
  currentFont = fonts[fontname];
  setTextPixels();
}
function setTextPixels(){
  const text = document.getElementById('text').value;
  const letters = text.split("");

  const letterToLines = {};

  const fontLines = currentFont.split('\n');
  const fontWidth = int(fontLines[0]);
  const fontHeight = int(fontLines[1]);
  let ptr = 2;
  while(ptr < fontLines.length){
    let buf = "";
    const c = fontLines[ptr];
    for(let i = 1; i <= fontHeight; i++){
      buf += `${fontLines[ptr + i ]}\n`;
    }
    letterToLines[c] = buf;
    ptr += int(fontHeight) + 1;
  }
  
  let left = 0;

  currentTextPixels = [];

  letters.forEach((letter)=>{
    if(letter === ' ') {
      left += 2;
    } else {
      const {pixels,width} = parseLetterLines(letterToLines[letter],left);
      currentTextPixels = currentTextPixels.concat(pixels);
      left += width;
    }
  });
  loop();
}

function parseLetterLines(linebuf, startWidth){
  const lines = linebuf.split("\n");

  const rawpairs = [];
  let maxX = 0;
  for(let y = 0; y < lines.length; y++){
    const line = lines[y];
    const bits = line.split('');
    for(let x = 0; x < bits.length; x++){
      const bit = bits[x];
      if(bit === 'X') {
        rawpairs.push({x,y});
        if(x > maxX) maxX = x;
      }

    }
  }
  const width = maxX + 2;
  const pixels = [];
  rawpairs.forEach((pair)=>{
    let {x,y} = pair;
    x += startWidth;
    pixels.push({x,y});
  });
  return {pixels,width};
}

/**
 *
function readImageFromArray(){
  if(! currentUploadedImage) return;
  clearYXGrid();

  currentShowingUploadedImage = currentUploadedImage;
  loop();
  loadPixels();
  console.log(pixels);
  const d = pixelDensity();
  for(let x = 0; x < W; x++){
    for(let y = 0; y < H; y++){
      const squareBoolean = readSquareFromArray(x,y,pixels,d);
      //console.log(squareBoolean);
      yxGrid[y][x] = !currentInvert ? squareBoolean: !squareBoolean ;
    }
  }
}

function readSquareFromArray(x,y,pixels,d){
  const squarecount = PIXW * PIXH; 
  let sum = 0;
  for(let px = x * PIXW; px < (x+1) * PIXW; px++){
    for(let py = y * PIXH; py < (y+1) * PIXH ; py++){
      // see https://p5js.org/reference/#/p5/pixels for example that has to loop over the density??
      const loc = 4 * d *  (x + (width * y)); //this needs to be fixed: 
      const r = pixels[loc];
      const g = pixels[loc+1];
      const b = pixels[loc+2];
      console.log({loc,r,g,b});
      sum += (r + g + b) / 3;
    }
  }
 // console.log((sum / squarecount),currentcurrentContrast,(sum / squarecount) > currentcurrentContrast);
  return (sum / squarecount) > currentcurrentContrast;
}
**/

function readImage(){
  if(! currentUploadedImage) return;
  clearYXGrid();

  currentShowingUploadedImage = currentUploadedImage;
  loop();
  for(let x = 0; x < W; x++){
    for(let y = 0; y < H; y++){
      const squareBoolean = readSquare(x,y);
      //console.log(squareBoolean);
      yxGrid[y][x] = !currentInvert ? squareBoolean: !squareBoolean ;
    }
  }
  console.log('parsed image');
  currentShowingUploadedImage = null;
  loop();
}

function readSquare(x,y){
  const squarecount = PIXW * PIXH; 
  let sum = 0;
  for(let px = x * PIXW; px < (x+1) * PIXW; px++){
    for(let py = y * PIXH; py < (y+1) * PIXH ; py++){
      const [r,g,b,a] = get(px,py);
      sum += (r + g + b) / 3;
    }
  }
 // console.log((sum / squarecount),currentcurrentContrast,(sum / squarecount) > currentcurrentContrast);
  return (sum / squarecount) > currentcurrentContrast;
}

function handleContrast(){
  currentcurrentContrast = document.getElementById("contrast").value;
  readImage();
}

function handleInvert(){
  currentInvert = document.getElementById("invert").checked;
  readImage();
}