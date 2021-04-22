const modes = {
    player48mono: {
      ATARI_WIDTH: 48,
      ATARI_MAXHEIGHT: 192,
      ATARI_STARTHEIGHT:75,
      SCREEN_WIDTH_PER: 8,
      SCREEN_HEIGHT_PER: 5,
      MULTICOLOR: false,
      DOWNLOADBAS: ()=>{download("splash.bas",code48pxBBWrap());},
      DOWNLOADASM: ()=>{download("splash.asm",code48pxMonoASM());}
  },
    player48color: {
      ATARI_WIDTH: 48,
      ATARI_MAXHEIGHT: 192,
      ATARI_STARTHEIGHT:75,
      SCREEN_WIDTH_PER: 8,
      SCREEN_HEIGHT_PER: 5,
      MULTICOLOR: true,
      DOWNLOADBAS: ()=>{download("splash.bas",code48pxBBWrap());},
      DOWNLOADASM: ()=>{download("splash.asm",code48pxColorASM());}
    },

    bbPFcolors:{
      ATARI_WIDTH: 32,
      ATARI_MAXHEIGHT: 11,
      ATARI_STARTHEIGHT:11,
      SCREEN_WIDTH_PER: 16,
      SCREEN_HEIGHT_PER: 32,
      MULTICOLOR: true,
      HORIZGAP: 1,
      DOWNLOADBAS: ()=>{download("splash.bas",codeBBpfColors());},
    },

 


    bbPFDPCcolors:{
      ATARI_WIDTH: 32,
      ATARI_MAXHEIGHT: 88,
      ATARI_STARTHEIGHT:88,
      SCREEN_WIDTH_PER: 16,
      SCREEN_HEIGHT_PER: 4,
      MULTICOLOR: true,
      MULTICOLORBG: true,
      DOWNLOADBAS: ()=>{download("splash.bas",codeBBpfDPC());},
    },

    AssymPF1Scanline: {
      ATARI_WIDTH: 40,
      ATARI_MAXHEIGHT: 192,
      ATARI_STARTHEIGHT:44,
      SCREEN_WIDTH_PER: 16,
      SCREEN_HEIGHT_PER: 2,
      MULTICOLOR: true,
      DOWNLOADASM: ()=>{download("splash.asm",codeASMpfAssymRepeated(1));},
      DOWNLOADASMSUPPORT: true
    },
    

  }

 