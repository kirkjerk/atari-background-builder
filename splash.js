
const modes = {
  player48mono: {
    ATARI_WIDTH: 48,
    ATARI_MAXHEIGHT: 192,
    ATARI_STARTHEIGHT:48,
    SCREEN_WIDTH_PER: 8,
    SCREEN_HEIGHT_PER: 5,
    MULTICOLOR: false
},
  player48color: {
    ATARI_WIDTH: 48,
    ATARI_MAXHEIGHT: 192,
    ATARI_STARTHEIGHT:48,
    SCREEN_WIDTH_PER: 8,
    SCREEN_HEIGHT_PER: 5,
    MULTICOLOR: true
  }
}

const toolFunctions = {
  draw: {
    mousePressed: (gridX,gridY) => {
      yxGrid[gridY][gridX] = currentInkBoolean;
    },
    mouseDragged: (sx,sy,ex,ey) => {
      const spots = getAllSpotsBetween(sx,sy,ex,ey); 
      spots.map((spot)=>{
        yxGrid[spot.y][spot.x] = currentInkBoolean;
      });
    },
    mouseReleased:() => {},
    showHotSpots: () => false
  },

  color: {
    mousePressed: (gridX,gridY) => {
      colorGrid[gridY] = currentFGColor;
    },
    mouseDragged: (sx,sy,ex,ey) => {
      const spots = getAllSpotsBetween(sx,sy,ex,ey); 
      spots.map((spot)=>{
        colorGrid[spot.y] = currentFGColor;
      });
    },
    mouseReleased:() => {},
    showHotSpots: () => false
  },

line:{
  mousePressed: (gridX,gridY) => {
    currentStartMouseX = mouseX;
    currentStartMouseY = mouseY;
  },
  mouseDragged:(sx,sy,ex,ey) =>{
    currentHotSpots = getAllSpotsBetween(currentStartMouseX,currentStartMouseY,ex,ey); 
  },
  mouseReleased:()=>{
    currentHotSpots.map((spot)=>{
      yxGrid[spot.y][spot.x] = currentInkBoolean;
    });
    currentHotSpots = [];
  },
  showHotSpots: () => true
},

rect:{
  mousePressed: (gridX,gridY) => {
    currentStartMouseX = mouseX;
    currentStartMouseY = mouseY;
  },
  mouseDragged:(sx,sy,ex,ey) =>{
    currentHotSpots = getAllRectSpotsBetween(currentStartMouseX,currentStartMouseY,ex,ey); 
  },
  mouseReleased:()=>{
    currentHotSpots.map((spot)=>{
      yxGrid[spot.y][spot.x] = currentInkBoolean;
    });
    currentHotSpots = [];
  },
  showHotSpots: () => true
}

}


let currentMode;
let currentTool = 'draw';
let currentToolFunctions = toolFunctions[currentTool];
let currentInkMode = 'toggle';
let currentInkBoolean = false; 
let currentTVMode = 'ntsc';
let currentFGColor = '0E';
let currentBGColor = '00';
let currentColorPickerTarget='fg';


let W;
let H;
let PIXW;
let PIXH;

let currentStartMouseX;
let currentStartMouseY;
let currentHotSpots = [];

let yxGrid = Array();
let colorGrid = Array();


let sx,sy,ex,ey;


function setup() {
  setCurrentMode(modes.player48color);
  for (let y = 0; y < H; y++) {
    yxGrid[y] = Array();
  }

  createCanvas(W * PIXW, H * PIXH).parent('canvasParent');
  makePicker();

}

function setCurrentMode(mode){
  W = mode.ATARI_WIDTH;
  H = mode.ATARI_STARTHEIGHT;
  PIXW = mode.SCREEN_WIDTH_PER;
  PIXH = mode.SCREEN_HEIGHT_PER;
  document.getElementById("height").value = H;
  document.getElementById("maxheight").innerHTML = mode.ATARI_MAXHEIGHT;
  
  const colorToolElem = document.getElementById('colortool');
  colorToolElem.style.display = mode.MULTICOLOR ? 'block':'none';
  const colorPickShowElem = document.getElementById('hovercolorlabel');
  colorPickShowElem.style.display = mode.MULTICOLOR ? 'block':'none';
  

  currentMode = mode;
  fillBlankColorGridWithDefault();
  loop();
}

function fillBlankColorGridWithDefault(){
  if(currentMode.MULTICOLOR){
    for(let y = 0; y < H; y++){
      if(! colorGrid[y]){
        colorGrid[y] = currentFGColor;
      }
    }
  }
}

function getColorForRow(y,half){
  const alpha = half?'87':'';
  if(! currentMode.MULTICOLOR || ! colorGrid[y]) {
    return `#${HUELUM2HEX[currentTVMode][currentFGColor]}${alpha}`;
  } else {
    return `#${HUELUM2HEX[currentTVMode][colorGrid[y]]}${alpha}`;
  }
}


function draw() {
  background(`#${HUELUM2HEX[currentTVMode][currentBGColor]}`);
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
rect(x * PIXW, y * PIXH, PIXW, PIXH);

// show hot spots for rect tool or line tool...
if(mouseIsPressed && currentToolFunctions.showHotSpots()){
  //half tone current color or black
  fill(currentInkBoolean ? getColorForRow(y,true) : `#00000087`);
    currentHotSpots.map((spot)=>{
        rect(spot.x * PIXW, spot.y * PIXH, PIXW, PIXH); 
    });
}


if(currentMode.MULTICOLOR){
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

function mouseOutOfBounds(){
  return (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height);
}


function mousePressed() {
if(mouseOutOfBounds()) return;


const gridX = int(mouseX / PIXW);
const gridY = int(mouseY / PIXH);

if(currentInkMode == 'toggle') {
  currentInkBoolean = !yxGrid[gridY][gridX];
} else {
  currentInkBoolean = (currentInkMode == 'draw');
}
currentToolFunctions.mousePressed(gridX,gridY);
  loop();
}

function mouseDragged() {
  if(mouseOutOfBounds()) return;
  const sx = pmouseX;
  const sy = pmouseY;
  const ex = mouseX;
  const ey = mouseY;

  currentToolFunctions.mouseDragged(sx,sy,ex,ey);
  showHoverColor();
  loop();
}

function mouseMoved(){
  if(mouseOutOfBounds()) return;
  showHoverColor();
  loop();
}

function mouseReleased(){  
  if(mouseOutOfBounds()) return;
  currentToolFunctions.mouseReleased();
  loop();
}

//take the mouse x,y for start and end,
//return an array of {x:__,y:__} spots that are in rectangle inbetween

function getAllRectSpotsBetween(sx,sy,ex,ey){
const gsx = min(int(sx / PIXW),int(ex / PIXW));
const gsy = min(int(sy / PIXH),int(ey / PIXH));
const gex = max(int(sx / PIXW),int(ex / PIXW));
const gey = max(int(sy / PIXH),int(ey / PIXH));
const results = [];
for(x = gsx; x <= gex; x++){
  for(y = gsy; y <= gey; y++){
    results.push({x,y});
  }
}
return results;

}

//take the mouse x,y for start and end,
//return an array of {x:__,y:__} spots that are inbetween
function getAllSpotsBetween(sx,sy,ex,ey){
  const spots = {};
  const quantize = 400;
  for(let i = 0; i < quantize; i++){
    const tx = map(i,1,quantize,sx,ex); 
    const ty = map(i,1,quantize,sy,ey);
    const x = int(tx / PIXW);
    const y = int(ty / PIXH);
    if(x >= 0 && x < W && y >= 0 && y < H) {
        if(x >= 0 && x < W && y >= 0 && y < H) {
          spots[`${x}:${y}`] = true;
        }
    }
  } 
  
  const results = [];
  
  (Object.keys(spots).map((joint)=>{ 
      const[x,y] = joint.split(":");
      results.push({x,y});    
  }));
  return results;
}



function setTool(what){
  currentTool = what;   
  currentToolFunctions = toolFunctions[what];
}

function setInkmode(what){
  currentInkMode = what;
  currentInkBoolean = (what == 'erase') ? false : true;
}



function setNewHeight(){
  const elem = document.getElementById('height');
  const newHeight = elem.value;
  

  elem.classList.remove("error");

  

  if(isNaN(newHeight) || newHeight < 0 || newHeight > currentMode.ATARI_MAXHEIGHT){
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
    if(currentMode.MULTICOLOR) {
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



