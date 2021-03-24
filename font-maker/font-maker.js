
const allchars = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,.?!:;()/@#$%^&+-*=~_{}[]<>|"'`;
const NUMACROSS = 8;

let GRIDX = 3;
let GRIDY = 4;
let BOXWIDTH;
let BOXHEIGHT;
let GRIDBLOCKSIZE;

const TEXTWIDTH=16;

let currentMouseDrawMode = false;

const blocks = [];

function setup(){
    var canvas = createCanvas(800, 1200);
    canvas.parent("canvasParent");
    textSize(TEXTWIDTH);
    textAlign(CENTER,TOP);

    populateWxHForm();


    for(let i = 0; i < allchars.length; i++){
        blocks.push(makeBlock(i));
    }
    calculateWxHStuff();
    
};

function calculateWxHStuff(){
    BOXWIDTH = width / NUMACROSS;
    BOXHEIGHT =  height/ceil(allchars.length/NUMACROSS);
 
    const widthToPlay = BOXWIDTH - TEXTWIDTH;
    const heightToPlay = BOXHEIGHT - 4; 
    GRIDBLOCKSIZE = min(widthToPlay/GRIDX,heightToPlay/GRIDY);
    for(let i = 0; i < allchars.length; i++){
        positionBlock(i,blocks[i]);
    }
}

function populateWxHForm(){
    document.getElementById('GRIDX').value = GRIDX;
    document.getElementById('GRIDY').value = GRIDY;
}
function updateFromWxHForm(){
    GRIDX = document.getElementById('GRIDX').value;
    GRIDY = document.getElementById('GRIDY').value;
    calculateWxHStuff();
    loop();
}


function draw(){

    background(255); noStroke(); fill(0);
    blocks.map(block=>drawBlock(block));
    
    drawHilite(findBlockAndPos(mouseX,mouseY));

    noLoop();
}

function drawHilite(found){
    if(! found) return;
    const { block, x, y } = found;
    noStroke();
    fill(255,0,0,128);
    push();
    translate(block.x + TEXTWIDTH, block.y);
    rect(x * GRIDBLOCKSIZE,y*GRIDBLOCKSIZE,GRIDBLOCKSIZE,GRIDBLOCKSIZE);
    pop();
}


function findBlockAndPos(mx,my){
    let foundBlock, x, y;
    blocks.forEach((block)=>{
        const leftWall =  block.x + TEXTWIDTH;
        const topWall = block.y;
        if(mx > leftWall && mx < leftWall + (GRIDBLOCKSIZE * GRIDX)
            && my > topWall && my < topWall + (GRIDBLOCKSIZE * GRIDY)){
                    foundBlock = block;
                    x = int((mx - leftWall) / GRIDBLOCKSIZE);
                    y = int((my -  topWall) / GRIDBLOCKSIZE);
        }
    });
    return foundBlock? {block:foundBlock,x,y} : null;

}


function drawBlock(block){
    const {c,x,y,pixels} = block;
    
    noStroke();    
    
    fill(128,0,0);
    text(c,x,y,16,BOXHEIGHT);
    stroke(128); 

    push();
    translate(x+TEXTWIDTH,y);
    for(let i = 0; i < GRIDX; i++){
        for(let j = 0; j < GRIDY; j++){

            fill(pixels[`${i}_${j}`]? 0: 255);
            rect(i * GRIDBLOCKSIZE,j*GRIDBLOCKSIZE,GRIDBLOCKSIZE,GRIDBLOCKSIZE);
        }
    }
    pop();
}
function makeBlock(pos){
    const c = allchars.charAt(pos);
    return {c,pixels:{}};
}

function positionBlock(pos,block){
    block.x = BOXWIDTH * (pos % NUMACROSS);
    block.y = BOXHEIGHT * floor(pos/NUMACROSS);
    
}

function mouseMoved(){
    loop();
}
function mousePressed(){
    const found = findBlockAndPos(mouseX,mouseY);
    if(! found) return;
    const { block, x, y } = found;
    currentMouseDrawMode = block.pixels[`${x}_${y}`] ? false : true;
    setPixel(block,x,y,currentMouseDrawMode);
    loop();
}
function mouseDragged(){
    const found = findBlockAndPos(mouseX,mouseY);
    if(! found) return;
    const { block, x, y } = found;
    setPixel(block,x,y,currentMouseDrawMode);
    loop();
}

function setPixel(block,x,y,doset){
    if(x < 0 || x >= GRIDX || y < 0 || y >= GRIDY) return;
    if(doset){
        block.pixels[`${x}_${y}`]=doset;
    } else {
        delete(block.pixels[`${x}_${y}`]);
    }
}


function makeFontString(){
    let buf = `${GRIDX}\n${GRIDY}\n`;
    blocks.forEach((block)=>{
        console.log(block);
        const keys = Object.keys(block.pixels);
        if(keys.length > 0){
            buf += `${block.c}\n`;
            for(let y = 0; y < GRIDY; y++){
                for(let x = 0; x < GRIDX; x++){
                    
                    buf += block.pixels[`${x}_${y}`] ? 'X' : '.';
                }
                buf += '\n';
            }
        }
    });
    document.getElementById("output").value=buf;


}