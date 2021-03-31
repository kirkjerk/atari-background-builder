const modes = {
    player48mono: {
      ATARI_WIDTH: 48,
      ATARI_MAXHEIGHT: 192,
      ATARI_STARTHEIGHT:75,
      SCREEN_WIDTH_PER: 8,
      SCREEN_HEIGHT_PER: 5,
      MULTICOLOR: false,
      DOWNLOADBAS: ()=>{download("splash.bas",get48pxBasic());},
      DOWNLOADASM: ()=>{download("splash.asm",get48pxMonoASM());}
  },
    player48color: {
      ATARI_WIDTH: 48,
      ATARI_MAXHEIGHT: 192,
      ATARI_STARTHEIGHT:75,
      SCREEN_WIDTH_PER: 8,
      SCREEN_HEIGHT_PER: 5,
      MULTICOLOR: true,
      DOWNLOADBAS: ()=>{download("splash.bas",get48pxBasic());},
      DOWNLOADASM: ()=>{download("splash.asm",get48pxColorASM());}
    },

    bbPFcolors:{
      ATARI_WIDTH: 32,
      ATARI_MAXHEIGHT: 11,
      ATARI_STARTHEIGHT:11,
      SCREEN_WIDTH_PER: 16,
      SCREEN_HEIGHT_PER: 32,
      MULTICOLOR: true,
      HORIZGAP: 1,
      DOWNLOADBAS: ()=>{download("splash.bas",getBBPFColors());},
    },

    bbPFDPCcolors:{
      ATARI_WIDTH: 32,
      ATARI_MAXHEIGHT: 88,
      ATARI_STARTHEIGHT:88,
      SCREEN_WIDTH_PER: 16,
      SCREEN_HEIGHT_PER: 4,
      MULTICOLOR: true,
      DOWNLOADBAS: ()=>{download("splash.bas",getBBPFDPCColors());},
    }


  }