function setInYXGrid(gridX,gridY,value){
    if(outOfBoundsYXGrid(gridX,gridY)) return;
    yxGrid[gridY][gridX] = value;
    yxGrid[gridY][getSymmPixel(gridX)] = value;
}

function getSymmPixel(x){
  if(! currentKernelMode.PIXDUP) return x;
  const midpoint = (currentKernelMode.ATARI_WIDTH / 2);
  if(currentKernelMode.PIXDUP === 'mirror') {
    const delta = ( midpoint - 1) - x;
    return midpoint + delta;
  }  
  if(currentKernelMode.PIXDUP === 'repeat') {
    const delta = x % midpoint;
    return x < midpoint ? midpoint + delta : delta;
  }  
}


function includeMirrorSpots(oldspots){
  const spots = [...oldspots];
  oldspots.forEach((spot)=>{
    spots.push({x:getSymmPixel(spot.x),y:spot.y});
  });
  return spots;
}

function getInYXGrid(gridX,gridY){
    if(outOfBoundsYXGrid(gridX,gridY)) return undefined;
    return yxGrid[gridY][gridX];
}
function outOfBoundsYXGrid(gridX,gridY){
  return (gridX < 0 || gridX >= W || gridY < 0 || gridY >= H);
}
function blankForCurrentFill(gridX,gridY){
  return (!outOfBoundsYXGrid(gridX,gridY)) && (! getInYXGrid(gridX,gridY) == currentInkBoolean);
}
function fillSquareAndRecurse(gridX,gridY){
  setInYXGrid(gridX,gridY,currentInkBoolean);
  if(blankForCurrentFill(gridX-1,gridY)) fillSquareAndRecurse(gridX-1,gridY);
  if(blankForCurrentFill(gridX+1,gridY)) fillSquareAndRecurse(gridX+1,gridY);
  if(blankForCurrentFill(gridX,gridY-1)) fillSquareAndRecurse(gridX,gridY-1);
  if(blankForCurrentFill(gridX,gridY+1)) fillSquareAndRecurse(gridX,gridY+1);  
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
        console.log('color pressed');
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
        console.log('color dragged');
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
    gradiant: {
      mousePressed: (gridX,gridY) => {
        if(!inBoundsAtariPixels(gridX,gridY)) {
          currentHotSpots = [];
          return;
        }
        currentStartMouseX = mouseX;
        currentStartMouseY = mouseY;
      },
      mouseMoved: ()=>{},
      mouseDragged: (sx,sy,ex,ey) => {
        const gridSX = int(sx / PIXW);
        const gridSY = int(sy / PIXH);
        const gridEX = int(ex / PIXW);
        const gridEY = int(ey / PIXH);
        if(inBoundsAtariPixels(gridSX,gridSY) && inBoundsAtariPixels(gridEX,gridEY)) {
          currentHotSpots = getAllSpotsBetween(currentStartMouseX,currentStartMouseY,ex,ey); 
        }
      },
      mouseReleased:() => {
        const mapYs = {};
        const uniqueSpotYs = [];
        console.log({currentHotSpots});
        if(currentHotSpots.length == 0) return;
        currentHotSpots.forEach((spot)=>{
          if(! mapYs[spot.y]){
            mapYs[spot.y] = spot;
            uniqueSpotYs.push(spot.y);
          } 
        });
        const spotcount = uniqueSpotYs.length - 1; //make it inclusive of endpoints for mapping
        uniqueSpotYs.forEach((y,i)=>{
          
          const currentStartColorHex = currentGradFGBG == 'fg' ? currentGradFGStart : currentGradBGStart;
          const currentStopColorHex = currentGradFGBG == 'fg' ? currentGradFGStop : currentGradBGStop;
          const currentStartColorVal = parseInt(currentStartColorHex, 16);
          const currentStopColorVal = parseInt(currentStopColorHex, 16);
          
          //round number to 2...
          const newColorValueInt = (parseInt(map(i/spotcount,0,1.0,currentStartColorVal,currentStopColorVal)/2)*2);
          //uppser case,make two digits, prepadded  with 0
          const newColorValueHex = ('00'+newColorValueInt.toString(16).toUpperCase()).slice(-2);
          console.log(newColorValueInt,newColorValueHex);
          console.log(currentGradFGBG);
          if((!currentKernelMode.MULTICOLORBG) || currentGradFGBG == 'fg'){
            setInColorGrid(y, newColorValueHex); 
          } else {
            setInColorBgGrid(y, newColorValueHex); 
          }
        });
        console.log(colorGrid); 
        console.log(colorBgGrid); 
        
/*
        if((!currentKernelMode.MULTICOLORBG) || currentFGradaintGBG == 'fg'){
          spots.map((spot)=>{
              setInColorGrid(spot.y, currentFGColor); 
              console.log(spot.y);
          });
        } else {
          spots.map((spot)=>{
            setInColorBgGrid(spot.y, currentBGColor); 
          });
        }*/
        //console.log(uniqueSpotYs);



      },
      showHotSpots: () => mouseIsPressed,
      showHover: () => true
    },


  line:{
    mousePressed: (gridX,gridY) => {
      currentStartMouseX = mouseX;
      currentStartMouseY = mouseY;
    },
    mouseMoved: ()=>{},
    mouseDragged:(sx,sy,ex,ey) =>{
      currentHotSpots = includeMirrorSpots(getAllSpotsBetween(currentStartMouseX,currentStartMouseY,ex,ey)); 

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
      currentHotSpots = includeMirrorSpots(getAllRectSpotsBetween(currentStartMouseX,currentStartMouseY,ex,ey)); 
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

  ellipse:{
    mousePressed: (gridX,gridY) => {
      currentStartMouseX = mouseX;
      currentStartMouseY = mouseY;
    },
    mouseMoved: ()=>{},
    mouseDragged:(sx,sy,ex,ey) =>{
      currentHotSpots = includeMirrorSpots(getAllEllipseSpotsBetween(currentStartMouseX,currentStartMouseY,ex,ey)); 
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


  fill:{
    mousePressed: (gridX,gridY) => {
      //console.log(`fill ${gridX} ${gridY} ${currentInkBoolean}`);
      if(blankForCurrentFill(gridX,gridY)){
        fillSquareAndRecurse(gridX,gridY);
      }
      loop();
    },
    mouseMoved: ()=>{},
    mouseDragged:()=>{},
    mouseReleased:()=>{},
    showHotSpots: () => false,
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
        currentHotSpots = includeMirrorSpots(currentHotSpots);
        
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
          currentHotSpots = includeMirrorSpots(currentHotSpots);
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

    function getAllEllipseSpotsBetween(rawcenterx,rawcentery,endx,endy){
      const results = [];

      //normalize centerx to be the screen pixel actually in the middle of the atari pixel
      const centerx = (int(rawcenterx / PIXW) + .5) * PIXW;
      const centery = (int(rawcentery / PIXH) + .5) * PIXH;

      //const radiusScreenies = dist(centerx,centery,endx,endy);
      
      for(let y = 0; y < H; y++){
        for(let x = 0; x < W; x++){
          const xScreenies = PIXW * (x + .5);
          const yScreenies = PIXH * (y + .5);
          //console.log(x,y);
          //if(dist(centerx, centery, xScreenies, yScreenies) <= radiusScreenies){
          if(isScreenPointInEllipse(centerx,centery,xScreenies,yScreenies,endx,endy)){
            results.push({x,y});
          }
        }
      }
      return results;      
      }

      function isScreenPointInEllipse(centerx,centery,xScreenies,yScreenies,endx,endy){
        const mathResult = checkpoint(centerx,centery,xScreenies,yScreenies,endx-centerx, endy-centery);
        
        return mathResult <= 1;
      }


      //from https://www.geeksforgeeks.org/check-if-a-point-is-inside-outside-or-on-the-ellipse/
      function checkpoint(h , k , x , y , a , b)
      {
          // checking the equation of
          // ellipse with the given point
          var p = (parseInt(Math.pow((x - h), 2)) / parseInt(Math.pow(a, 2)))
                  + (parseInt(Math.pow((y - k), 2)) / parseInt(Math.pow(b, 2)));
          return p;
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