function setInYXGrid(gridX,gridY,value){
    if(gridX < 0 || gridX >= W || gridY < 0 || gridY >= H) return;
    yxGrid[gridY][gridX] = value;
}
function getInYXGrid(gridX,gridY){
    if(gridX < 0 || gridX >= W || gridY < 0 || gridY >= H) return false;
    return yxGrid[gridY][gridX];
}


function setInColorGrid(gridY,value){
    if(gridY < 0 || gridY >= H) return;
    colorGrid[gridY] = value;
}
function setInColorBgGrid(gridY,value){
  if(gridY < 0 || gridY >= H) return;
  colorBgGrid[gridY] = value;
}

const toolFunctions = {
    draw: {
      mousePressed: (gridX,gridY) => {
        setInYXGrid(gridX,gridY,currentInkBoolean);
      },
      mouseMoved: ()=>{},
      mouseDragged: (sx,sy,ex,ey) => {
        const spots = getAllSpotsBetween(sx,sy,ex,ey); 
        //console.log(spots.length, JSON.stringify(spots));
        spots.map((spot)=>{
          setInYXGrid(spot.x,spot.y,currentInkBoolean);
        });
      },
      mouseReleased:() => {},
      showHotSpots: () => false,
      showHover: () => true
    },
  
    color: {
      mousePressed: (gridX,gridY) => {
        if(!currentEyedrop){
          if(inBoundsAtariPixels(gridX,gridY)) {
            colorGrid[gridY] = currentFGColor;
          }
        } else {
          if(! currentKernelMode.MULTICOLORBG || currentFGBG == 'fg'){
            setFGColor(colorGrid[gridY]);
          } else {
            setBGColor(colorBgGrid[gridY]);
          }
          stopEyedrop();
        }
      },
      mouseMoved: ()=>{},
      mouseDragged: (sx,sy,ex,ey) => {
        const spots = getAllSpotsBetween(sx,sy,ex,ey); 
        if((!currentKernelMode.MULTICOLORBG) || currentFGBG == 'fg'){
          spots.map((spot)=>{
              setInColorGrid(spot.y, currentFGColor); 
          });
        } else {
          spots.map((spot)=>{
            setInColorBgGrid(spot.y, currentBGColor); 
          });
        }
      },
      mouseReleased:() => {},
      showHotSpots: () => false,
      showHover: () => true
    },
  
  line:{
    mousePressed: (gridX,gridY) => {
      currentStartMouseX = mouseX;
      currentStartMouseY = mouseY;
    },
    mouseMoved: ()=>{},
    mouseDragged:(sx,sy,ex,ey) =>{
      currentHotSpots = getAllSpotsBetween(currentStartMouseX,currentStartMouseY,ex,ey); 
    },
    mouseReleased:()=>{
      currentHotSpots.map((spot)=>{
        setInYXGrid(spot.x,spot.y,currentInkBoolean);
      });
      currentHotSpots = [];
    },
    showHotSpots: () => mouseIsPressed,
    showHover: () => true
  },
  
  rect:{
    mousePressed: (gridX,gridY) => {
      currentStartMouseX = mouseX;
      currentStartMouseY = mouseY;
    },
    mouseMoved: ()=>{},
    mouseDragged:(sx,sy,ex,ey) =>{
      currentHotSpots = getAllRectSpotsBetween(currentStartMouseX,currentStartMouseY,ex,ey); 
    },
    mouseReleased:()=>{
      currentHotSpots.map((spot)=>{
        setInYXGrid(spot.x,spot.y,currentInkBoolean);
      });
      currentHotSpots = [];
    },
    showHotSpots: () => mouseIsPressed,
    showHover: () => true
  },
  
  select:{
    mousePressed: (gridX,gridY) => {
      currentStartMouseX = mouseX;
      currentStartMouseY = mouseY;
    },
    mouseMoved: ()=>{},

    mouseDragged:(sx,sy,ex,ey) =>{
      currentHotSpots = getAllRectSpotsBetween(currentStartMouseX,currentStartMouseY,ex,ey); 
    },
    mouseReleased:()=>{},
    showHotSpots: () => true,
    showHover: () => false
  },
  
  
    text:{
      mousePressed: (gridX,gridY) => {
        currentHotSpots.map((spot)=>{
          setInYXGrid(spot.x,spot.y,currentInkBoolean);
        });
        currentHotSpots = [];
      },
      mouseMoved: (gridX,gridY)=>{
        currentHotSpots = [];
        currentTextPixels.forEach((pixel)=>{
          currentHotSpots.push({x:gridX+pixel.x, y:gridY+pixel.y});
        });
        
      },
      mouseDragged:(sx,sy,ex,ey) =>{},
      mouseReleased:()=>{},
      showHotSpots: () => true,
      showHover: () => false
    },
  
    paste:{
        mousePressed: (gridX,gridY) => {
          currentHotSpots.map((spot)=>{
            setInYXGrid(spot.x,spot.y,true);
          });
          currentHotSpots = [];
        },
        mouseMoved: (gridX,gridY)=>{
          currentHotSpots = [];
          currentClipboard.forEach((pixel)=>{
            currentHotSpots.push({x:gridX+pixel.x, y:gridY+pixel.y});
          });
        },
        mouseDragged:(sx,sy,ex,ey) =>{},
        mouseReleased:()=>{},
        showHotSpots: () => true  ,
        showHover: () => false  
    
      }

  
  }



function inBoundsAtariPixels(x,y){
  return x >= 0 && x < W && y >= 0 && y < H;
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
        if(inBoundsAtariPixels(x,y)){
            spots[`${x}:${y}`] = true;
        }
      } 
      
      const results = [];
      
      (Object.keys(spots).map((joint)=>{ 
          const[x,y] = joint.split(":");
          results.push({x,y});    
      }));
      return results;
    }



    function doCut(){
        doCutOrCopy(true);
    }


    function doCopy(){
        doCutOrCopy(false);
    }

    function doCutOrCopy(remove){
        currentClipboard = [];
        
        let lowestX = W;
        let lowestY = H;
        let highestX = 0;
        let highestY = 0;

        currentHotSpots.forEach((spot) => {
            if(spot.x < lowestX) lowestX = spot.x;
            if(spot.y < lowestY) lowestY = spot.y;
            if(spot.x > highestX) highestX = spot.x;
            if(spot.y > highestY) highestY = spot.y;
        });

        const offsetX = int ((lowestX + highestX) / 2);
        const offsetY = int ((lowestY + highestY) / 2);
        
        //const offsetX = int(currentStartMouseX/PIXW);
        //const offsetY = int(currentStartMouseY/PIXH);
        currentHotSpots.forEach((spot) => {
            if(yxGrid[spot.y][spot.x]) {
                currentClipboard.push({x:spot.x - offsetX, y: spot.y - offsetY});
                if(remove) yxGrid[spot.y][spot.x] = false;
            }
        });

        document.getElementById("toolpaste").click();
        loop();
      
    }