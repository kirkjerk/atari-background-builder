
let currentProjectname;
let currentKernelMode;
let currentKernelModeName;
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
let currentContrast = 128;
let currentInvert = false;
let currentFGBG = 'fg';
let currentEyedrop = false;


let currentGradFGStart = '00';
let currentGradFGStop = '0E';
let currentGradBGStart = '00';
let currentGradBGStop = '0E';
let currentGradFGBG = 'fg';

let W;
let H;
let PIXW;
let PIXH;


let yxGrid = Array();
let colorGrid = Array();
let colorBgGrid = Array();


let sx,sy,ex,ey;



function preload(){
  // currentUploadedImage = loadImage('doublefine.png');
  // currentShowingUploadedImage = currentUploadedImage;
}

function setup() {
  
  const initialKernel = 'player48color';  // 'player48color' 'bbPFDPCcolors' 'AssymPF1Scanline'
  document.getElementById('selectKernel').value = initialKernel;

  setKernelMode(initialKernel);
  currentKernelModeName = initialKernel;
  
  document.getElementById("drawtool").click();
//drawtool
//gradianttool

  clearYXGrid();
  createCanvas(W * PIXW, H * PIXH).parent('canvasParent');
  //makePicker();
  setFont('tiny3ishx4');
  //document.getElementById("picktext").click();


  createFileInput(loadImageFile).parent("imagefileButtonWrapper");
  createFileInput(loadProjectFile).parent("projectfileButtonWrapper");

  makeGradiantTable();
  blockCanvasContextMenus();
}

function blockCanvasContextMenus(){
    for (let element of document.getElementsByClassName("p5Canvas")) {
      element.addEventListener("contextmenu", (e) => e.preventDefault());
    }
}


function clearYXGrid() {
  yxGrid = makeUpBlankGrid();
}
function makeUpBlankGrid(){
  const grid = Array();
  for (let y = 0; y < 256; y++) {
    grid[y] = Array();
  }
  return grid;
}


function loadImageFile(file){
  if (file.type === 'image') {
    currentUploadedImage = createImg(file.data, '');
    currentUploadedImage.hide();
    launchReadImage(true);
    draw();

  } else {
    currentUploadedImage = null;
  }  
}


function setKernelMode(modestring){
  console.log({modestring});
  const mode = modes[modestring];

  currentKernelMode = mode;
  currentKernelModeName = modestring;


  const{ATARI_WIDTH, ATARI_STARTHEIGHT, 
        SCREEN_WIDTH_PER, SCREEN_HEIGHT_PER, ATARI_MAXHEIGHT,
        DOWNLOADBAS, DOWNLOADASM, DOWNLOADASMSUPPORT, MULTICOLORBG , DESCRIPTION} = mode;

  W = ATARI_WIDTH;
  H = ATARI_STARTHEIGHT;
  PIXW = SCREEN_WIDTH_PER;
  PIXH = SCREEN_HEIGHT_PER;

  document.getElementById("kerneldesc").innerHTML = DESCRIPTION;

  document.getElementById("height").value = H;
  document.getElementById("maxheight").innerHTML = ATARI_MAXHEIGHT;
  
  document.getElementById("info").style.width = `${W*PIXW}px`;

  document.getElementById("buttonDownloadBas").style.display = DOWNLOADBAS ? 'inline-block' : 'none';
  document.getElementById("buttonDownloadAsm").style.display = DOWNLOADASM ? 'inline-block' : 'none';
  document.getElementById("asmSupportFiles").style.display = DOWNLOADASMSUPPORT ? 'inline-block' : 'none';
  
  document.getElementById("gradiantFGBG").style.display = MULTICOLORBG ? 'inline-block' : 'none';
  if(!MULTICOLORBG) {
    currentGradFGBG = 'fg';
  }

  document.getElementById("radiofg").style.visibility = MULTICOLORBG ? 'visible' : 'hidden';
  document.getElementById("radiobg").style.visibility = MULTICOLORBG ? 'visible' : 'hidden';


  fillBlankColorGridWithDefault();
  
  
  resizeCanvas(W*SCREEN_WIDTH_PER, H * SCREEN_HEIGHT_PER);
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
  if(currentKernelMode.MULTICOLORBG){
    for(let y = 0; y < H; y++){
      if(! colorBgGrid[y]){
        colorBgGrid[y] = currentBGColor;
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
function getBgColorForRow(y){
  if(! currentKernelMode.MULTICOLORBG || ! colorBgGrid[y]) {
    return `#${HUELUM2HEX[currentTVMode][currentBGColor]}`;
  } else {
    //console.log(colorBgGrid[y], );
    return `#${HUELUM2HEX[currentTVMode][colorBgGrid[y]]}`;
  }
}


function draw() {

  background(`#${HUELUM2HEX[currentTVMode][currentBGColor]}`);
  
  if(currentShowingUploadedImage){
      image(currentShowingUploadedImage, 0, 0, width, height);
      return;
  }

  noStroke();

  if(currentKernelMode.MULTICOLORBG){
    for (let y = 0; y < H; y++) {
      fill(getBgColorForRow(y));
      rect(0,y * PIXH, width, PIXH)
    }
  }

const horizgapsize = currentKernelMode.HORIZGAP ? 2 : 0
for (let x = 0; x < W; x++) {
  for (let y = 0; y < H; y++) {
    fill(getColorForRow(y));
    if (yxGrid[y][x]) rect(x * PIXW, y * PIXH, PIXW, PIXH-horizgapsize);
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
    rect(width - PIXW/4,y * PIXH,PIXW/4,PIXH);
  }
} 


noLoop();

}





function mousePressed() {

const gridX = int(mouseX / PIXW);
const gridY = int(mouseY / PIXH);

if(currentInkMode == 'toggle') {
  currentInkBoolean = !getInYXGrid(gridX,gridY);
} else if(currentInkMode == 'leftright') {
  currentInkBoolean = (mouseButton == LEFT);
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
  loop();
}

function mouseMoved(){
  const gridX = int(mouseX / PIXW);
  const gridY = int(mouseY / PIXH);
  currentToolFunctions.mouseMoved(gridX,gridY);
  loop();
}

function mouseReleased(){  
  currentToolFunctions.mouseReleased();
  loop();
}




const toolsWithSections = ["text","color","select", "gradiant"];

function setTool(what){
  currentTool = what;   
  currentToolFunctions = toolFunctions[what];

  stopEyedrop();

  cursor(ARROW);

  if(currentToolFunctions.cursor){
    cursor(currentToolFunctions.cursor);
  }

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
  const newHeight = parseInt(elem.value);
  
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


function makePicker(which){
  
  const parentElem = document.getElementById(`colorPickerHolder_${which}`);

  const table = document.createElement("table");
  table.classList.add("colorpick");

  
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
function removePicker(which){
  const parentElem = document.getElementById(`colorPickerHolder_${which}`);
  parentElem.innerHTML = '';
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
  if(currentColorPickerTarget) removePicker(currentColorPickerTarget);
  currentColorPickerTarget = which;
  makePicker(currentColorPickerTarget);
}
function closeAtariColorPicker(){
  removePicker(currentColorPickerTarget);
}
function clickAtariColor(atariKey){
  if(currentColorPickerTarget == 'fg') {
    setFGColor(atariKey);
    document.getElementById("radiofg").click();
  }
  if(currentColorPickerTarget == 'bg') {
    setBGColor(atariKey);
    document.getElementById("radiobg").click();
  }
  if(currentColorPickerTarget == 'gradfgstart') setCurrentGradFGStart(atariKey);
  if(currentColorPickerTarget == 'gradfgstop') setCurrentGradFGStop(atariKey);
  if(currentColorPickerTarget == 'gradbgstart') setCurrentGradBGStart(atariKey);
  if(currentColorPickerTarget == 'gradbgstop') setCurrentGradBGStop(atariKey);
  closeAtariColorPicker();
  if(!currentKernelMode.MULTICOLOR && currentColorPickerTarget == 'fg'){
    document.getElementById("drawtoolradio").click(); //automatically start drawing if mono...
  }

  makeGradiantTable();
}


function setTVMode(mode){
  currentTVMode = mode;
  //makePicker();
  displayCurrentFGColor();
  displayCurrentBGColor();
  displayCurrentGradiantColors();
  makeGradiantTable();
}
function setFGColor(atariKey){
  currentFGColor = atariKey;
  displayCurrentFGColor();
}
function setBGColor(atariKey){
  currentBGColor = atariKey;
  displayCurrentBGColor();
}
function setCurrentGradFGStart(atariKey){
  currentGradFGStart = atariKey;
  displayCurrentGradiantColors();
}
function setCurrentGradFGStop(atariKey){
  currentGradFGStop = atariKey;
  displayCurrentGradiantColors();
}
function setCurrentGradBGStart(atariKey){
  currentGradBGStart = atariKey;
  displayCurrentGradiantColors();
}
function setCurrentGradBGStop(atariKey){
  currentGradBGStop = atariKey;
  displayCurrentGradiantColors();
}


function setCurrentGradFGBG(atariKey){
  currentGradFGBG = atariKey;
}

function displayCurrentGradiantColors(){
  console.log('displayCurrentGradiantColors');
  const elemStart = document.getElementById('currentGradStart');
  const elemStop = document.getElementById('currentGradStop');
  showAtariColorOnElem(elemStart, currentGradFGBG == 'fg'? currentGradFGStart : currentGradBGStart );
  showAtariColorOnElem(elemStop, currentGradFGBG == 'fg'? currentGradFGStop : currentGradBGStop );
}


function setFGvsBG(which){
  currentFGBG = which;
}


function displayCurrentFGColor(){
  const elem = document.getElementById('currentFG');
  showAtariColorOnElem(elem,currentFGColor);
}
function displayCurrentBGColor(){
  const elem = document.getElementById('currentBG');
  showAtariColorOnElem(elem,currentBGColor);
}


function showAtariColorOnElem(elem, atariColor){
  elem.innerHTML = atariColor;
  const hexColor = `#${HUELUM2HEX[currentTVMode][atariColor]}`;
  elem.style.backgroundColor = hexColor;
  elem.classList.remove("light");
  elem.classList.remove("dark");
  
  elem.classList.add(textClassForHexBg(hexColor));
  console.log(elem.classList);
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
 * 
 * At some point the following might be more effecient way of 
 * reading in the damn pixels, but couldn't quite get it to work
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
 // console.log((sum / squarecount),currentContrast,(sum / squarecount) > currentContrast);
  return (sum / squarecount) > currentContrast;
}
**/ 
function currentLoadingDisplay(show) {
  document.getElementById('importmsg').style.visibility = show ? 'visible':'hidden';
}
// we want to update screen elements but with a timeout to get it out of the redraw loop
function launchReadImage(adjustContrast) {
  if(! currentUploadedImage) return;
  currentLoadingDisplay(true);
  setTimeout(()=>{readImage(adjustContrast)}, 0);
}

function readImage(adjustContrast){
  clearYXGrid();
  
  currentShowingUploadedImage = currentUploadedImage;
  draw();

  
  if(adjustContrast) {
    //const {contrast,grid} = findGridWithBestContrast();
    const {contrast,grid} = findGridWithMostContrastingNeighbors();
    yxGrid = grid;
    
    document.getElementById("contrast").value = contrast;
  } else {
    const {grid,pixelCount} = resampleImage(currentContrast);
    yxGrid = grid; 
    console.log(adjustContrast,pixelCount,W*H);
  }
  console.log('parsed image');
  currentShowingUploadedImage = null;
  currentLoadingDisplay(false);
  draw();
}


// we guesstimate that good images will have about half the pixels visible...
// at least better than all dark or all light

function findGridWithBestContrast(){
  const results = {};
  
  for(let contrast = 2; contrast <= 255; contrast+=50){
    results[contrast] = resampleImage(contrast);
  }
  const targetPixelCount = (W * H) / 2;
  let bestContrastSoFar = undefined;

  Object.keys(results).forEach((contrast)=>{
    console.log('test',contrast,results[contrast])
    if(! bestContrastSoFar) {
      bestContrastSoFar = contrast;
    } else {
      const test = results[contrast];
      if(abs(targetPixelCount - test.pixelCount) < abs(targetPixelCount - results[bestContrastSoFar].pixelCount)){
        bestContrastSoFar = contrast;
      }
    }
    
  });
  //bestContrastSoFar = 202;
  return {grid:results[bestContrastSoFar].grid, contrast:bestContrastSoFar};
}

function findGridWithMostContrastingNeighbors(){
  const results = {};
  
  for(let contrast = 2; contrast <= 255; contrast+=50){
    results[contrast] = resampleImage(contrast);
    console.log(contrast);
    results[contrast].neighborCount = getContrastingNeighborCount(results[contrast].grid);
  }
  let bestContrastSoFar = undefined;
  Object.keys(results).forEach((contrast)=>{
    if(! bestContrastSoFar) {
      bestContrastSoFar = contrast;
    } else {
      if(results[contrast].neighborCount > results[bestContrastSoFar].neighborCount){
        bestContrastSoFar = contrast;
      }
    }
  });
  return {grid:results[bestContrastSoFar].grid, contrast:bestContrastSoFar};
}

function getContrastingNeighborCount(grid){
  let count = 0;
  for(let x = 0; x < W; x++){
    for(let y = 0; y < H; y++){
      count += getContrastingNeighborCountForXY(grid,x,y);
    }
  }
  return count;
}
function getContrastingNeighborCountForXY(grid,x,y){
  const neighborDeltas = [ [-1,0],[1,0], [0,1],[0,-1]];
  let count = 0;
  neighborDeltas.forEach((delta)=>{
    [nx,ny] = delta;
    if(isInBounds(nx,ny) && grid[y][x] != grid[ny][nx] ) count++;
  });
  return count;
}
function isInBounds(x,y){
  return (x >= 0 && x < W && y >= 0 && y < H);
}

function resampleImage(contrast){
  const grid = makeUpBlankGrid();
  let pixelCount = 0;
  for(let x = 0; x < W; x++){
    for(let y = 0; y < H; y++){
      const squareBoolean = readSquare(x,y,contrast);

      pixelCount += squareBoolean ? 1 : 0;
      //console.log(squareBoolean);
      grid[y][x] = !currentInvert ? squareBoolean: !squareBoolean ;
    }
  }
  return {grid, pixelCount};
}

function readSquare(x,y,contrast){
  const squarecount = PIXW * PIXH; 
  let sum = 0;
  for(let px = x * PIXW; px < (x+1) * PIXW; px++){
    for(let py = y * PIXH; py < (y+1) * PIXH ; py++){
      const [r,g,b,a] = get(px,py);
      sum += (r + g + b) / 3;
    }
  }
 // console.log((sum / squarecount),currentContrast,(sum / squarecount) > currentContrast);
  return (sum / squarecount) > contrast;
}

function handleContrast(){
  currentContrast = document.getElementById("contrast").value;
  launchReadImage(false);
}

function handleInvert(){
  currentInvert = document.getElementById("invert").checked;
  launchReadImage(false);
}

function startEyedrop(){
  currentEyedrop = true;
  cursor(CROSS); 
}
function stopEyedrop(){
  currentEyedrop = false;
  cursor(ARROW);
}

function setCurrentGradFGBG(what){
  currentGradFGBG = what;
  displayCurrentGradiantColors();
  makeGradiantTable();
}

function makeGradiantTable(){
  let stopcolor, startcolor;
  if(currentGradFGBG == 'fg'){
    startcolor = currentGradFGStart;
    stopcolor = currentGradFGStop;
  } else {
    startcolor = currentGradBGStart;
    stopcolor = currentGradBGStop;
  }

  const startcolorval = parseInt(startcolor, 16);
  const stopcolorval = parseInt(stopcolor, 16);
  const spotcount = 30;

  for(let i = 0; i < spotcount; i++){
    const elem = document.getElementById(`grad${i}`);

    const newColorValueInt = (parseInt(map(i,0,spotcount-1,startcolorval,stopcolorval)/2)*2);
    //uppser case,make two digits, prepadded  with 0
    const newColorValueHex = ('00'+newColorValueInt.toString(16).toUpperCase()).slice(-2);
    const hexColor = `#${HUELUM2HEX[currentTVMode][newColorValueHex]}`;

    elem.style.backgroundColor = hexColor;
  }
}

function openGradiantAtariColorPicker(startOrStop){
  openAtariColorPicker(`grad${currentGradFGBG}${startOrStop}`);
}


function saveProject(){
  const projectname = prompt("Project name?", currentProjectname || "");
  currentProjectname = projectname;

  
  console.log({currentKernelModeName,currentTVMode,currentFGColor,currentBGColor});
  const project = {
    project: currentProjectname,
    mode:currentKernelModeName,
    height: H,
    tvmode: currentTVMode,
    FGColor: currentFGColor,
    BGColor: currentBGColor,
    yxGrid,
    colorGrid,
    colorBgGrid
  };

  download(`${currentProjectname}.abb.json`,JSON.stringify(project,null,' ')); 
}

function loadProjectFile(file){
  const project = file.data;
  currentProjectname = project.project;
  
  currentKernelModeName = project.mode;
  
  H = project.height;
  yxGrid = project.yxGrid;
  colorGrid = project.colorGrid;
  colorBgGrid = project.colorBgGrid;
  currentTVMode = project.tvmode;
  currentFGColor = project.FGColor;
  currentBGColor = project.BGColor;
  console.log({currentKernelModeName, currentTVMode,currentFGColor,currentBGColor});
  setKernelMode(project.mode);
  showUIFromCurrent();
  loop();
}

function showUIFromCurrent(){
  document.getElementById("selectKernel").value = currentKernelModeName;
  document.getElementById("height").value = H;
  setFGColor(currentFGColor);
  setBGColor(currentBGColor);
  setTVMode(currentTVMode);
  document.getElementById(`tv_${currentTVMode}`).checked = true;
  
}


//createFileInput(loadImageFile).parent("fileButtonWrapper");
// function loadImageFile(file){
//   if (file.type === 'image') {
//     currentUploadedImage = createImg(file.data, '');
//     currentUploadedImage.hide();
//     launchReadImage(true);
//     draw();

//   } else {
//     currentUploadedImage = null;
//   }  
// }