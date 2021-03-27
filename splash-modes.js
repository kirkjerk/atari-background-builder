const modes = {
    player48mono: {
      ATARI_WIDTH: 48,
      ATARI_MAXHEIGHT: 192,
      ATARI_STARTHEIGHT:48,
      SCREEN_WIDTH_PER: 8,
      SCREEN_HEIGHT_PER: 5,
      MULTICOLOR: false,
      DOWNLOADBAS: ()=>{download("splash.bas",get48pxBasic());},
      DOWNLOADASM: ()=>{download("splash.asm",get48pxMonoASM());}
  },
    player48color: {
      ATARI_WIDTH: 48,
      ATARI_MAXHEIGHT: 192,
      ATARI_STARTHEIGHT:48,
      SCREEN_WIDTH_PER: 8,
      SCREEN_HEIGHT_PER: 5,
      MULTICOLOR: true,
      DOWNLOADBAS: ()=>{download("splash.bas",get48pxBasic());},
      DOWNLOADASM: ()=>{download("splash.asm",get48pxColorASM());}
  
    }
  }