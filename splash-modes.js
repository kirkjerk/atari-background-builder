const modes = {
    player48mono: {
      ATARI_WIDTH: 48,
      ATARI_MAXHEIGHT: 192,
      ATARI_STARTHEIGHT:75,
      SCREEN_WIDTH_PER: 8,
      SCREEN_HEIGHT_PER: 5,
      MULTICOLOR: false,
      DOWNLOADBAS: ()=>{download("abb.bas",code48pxBBWrap());},
      DOWNLOADASM: ()=>{download("abb.asm",code48pxMonoASM());},
      NAME:'48px player mono',
      DESCRIPTION: 'Kernel with simple batari Basic wrapper (easily modifiable for use in assembly) Uses Player Graphics to get a 48px, monochrome image - great for splash screens.'
  },
    player48color: {
      ATARI_WIDTH: 48,
      ATARI_MAXHEIGHT: 192,
      ATARI_STARTHEIGHT:75,
      SCREEN_WIDTH_PER: 8,
      SCREEN_HEIGHT_PER: 5,
      MULTICOLOR: true,
      DOWNLOADBAS: ()=>{download("abb.bas",code48pxBBWrap());},
      DOWNLOADASM: ()=>{download("abb.asm",code48pxColorASM());},
      NAME:'48px player color',
      DESCRIPTION: 'Kernel with simple batari Basic wrapper (easily modifiable for use in assembly) Uses Player Graphics to get a 48px multicolor (one color per scanline) image - great for detailed splash screens.'
    },

    bbPFcolors:{
      ATARI_WIDTH: 32,
      ATARI_MAXHEIGHT: 11,
      ATARI_STARTHEIGHT:11,
      SCREEN_WIDTH_PER: 16,
      SCREEN_HEIGHT_PER: 32,
      MULTICOLOR: true,
      HORIZGAP: 1,
      DOWNLOADBAS: ()=>{download("abb.bas",codeBBpfColors());},
      NAME:'bB color PF',
      DESCRIPTION: 'Standard batari Basic PF (32x11, tall pixels, changeable in code, per-scanline playfield colors)'

    },

 


    bbPFDPCcolors:{
      ATARI_WIDTH: 32,
      ATARI_MAXHEIGHT: 88,
      ATARI_STARTHEIGHT:88,
      SCREEN_WIDTH_PER: 16,
      SCREEN_HEIGHT_PER: 4,
      MULTICOLOR: true,
      MULTICOLORBG: true,
      DOWNLOADBAS: ()=>{download("abb.bas",codeBBpfDPC());},
      NAME:'bB DPC+ color PF',
      DESCRIPTION: 'DPC+ / batari Basic code - utilizes custom cartridge hardware for fine, wide pixels, per-scanline colors for playfield AND per-scanline colors for background.'

    },

    AssymPFRepeated: {
      ATARI_WIDTH: 40,
      ATARI_MAXHEIGHT: 180,
      ATARI_STARTHEIGHT:80,
      SCREEN_WIDTH_PER: 16,
      SCREEN_HEIGHT_PER: 2,
      MULTICOLOR: true,
      DOWNLOADASM: ()=>{download("abb.asm",codeASMpfAssymRepeated(currentScanlinesPer));},
      DOWNLOADASMSUPPORT: true,
      NAME:'ASM Assymmetrical (Repeated) color',
      DESCRIPTION: 'Assembly Asymmetrical Playfield (Repeated) kernel, per scanline color change.',
      LINEHEIGHTS: true
    },

    AssymPFMirrored: {
      ATARI_WIDTH: 40,
      ATARI_MAXHEIGHT: 180,
      ATARI_STARTHEIGHT:80,
      SCREEN_WIDTH_PER: 16,
      SCREEN_HEIGHT_PER: 2,
      MULTICOLOR: true,
      DOWNLOADASM: ()=>{download("abb.asm",codeASMpfAssymMirrored(currentScanlinesPer));},
      DOWNLOADASMSUPPORT: true,
      NAME:'ASM Assymmetrical (Mirrored) color',
      DESCRIPTION: 'Assembly Asymmetrical Playfield (Mirrored) kernel, per scanline color change.',
      LINEHEIGHTS: true
    },
        
    SymPFMirrored: {
      ATARI_WIDTH: 40,
      ATARI_MAXHEIGHT: 180,
      ATARI_STARTHEIGHT:80,
      SCREEN_WIDTH_PER: 16,
      SCREEN_HEIGHT_PER: 2,
      MULTICOLOR: true,
      DOWNLOADASM: ()=>{download("abb.asm",codeASMpfSymMirrored(currentScanlinesPer));},
      DOWNLOADASMSUPPORT: true,
      NAME:'ASM Symmetrical (Mirrored) color',
      DESCRIPTION: 'Assembly Symmetrical Playfield (Mirrored) kernel, per scanline color change.',
      PIXDUP: 'mirror',
      LINEHEIGHTS: true
    },
    SymPFRepeated: {
      ATARI_WIDTH: 40,
      ATARI_MAXHEIGHT: 180,
      ATARI_STARTHEIGHT:80,
      SCREEN_WIDTH_PER: 16,
      SCREEN_HEIGHT_PER: 2,
      MULTICOLOR: true,
      DOWNLOADASM: ()=>{download("abb.asm",codeASMpfSymRepeated(currentScanlinesPer));},
      DOWNLOADASMSUPPORT: true,
      NAME:'ASM Symmetrical (Repeated) color',
      DESCRIPTION: 'Assembly Symmetrical Playfield (Repeated) kernel, per scanline color change.',
      PIXDUP: 'repeat',
      LINEHEIGHTS: true
    },        

    bBTitle_48x2: {
      ATARI_WIDTH: 40,
      ATARI_MAXHEIGHT: 85,
      ATARI_STARTHEIGHT:40,
      SCREEN_WIDTH_PER: 16,
      SCREEN_HEIGHT_PER: 4,
      MULTICOLOR: true,
      DOWNLOADASM: ()=>{download("48x2_1_image.asm",codeASMbBTitle_48x2());},
      NAME:'bB Titlescreen (mini)Kernel: 48x2',
      DESCRIPTION: 'Mini-Kernel to be inserted into titlescreen_kernel_1.8/titlescreen',
    }

    
  }

 