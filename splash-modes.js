function downloadMacro(){
  download('macro.h',getMACRO());
}
function downloadVCS(){
  download('vcs.h',getVCS());
}
function downloadFile(url) {
  const a = document.createElement('a')
  a.href = url
  a.download = url.split('/').pop()
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}


const modes = {
    player48mono: {
      ATARI_WIDTH: 48,
      ATARI_MAXHEIGHT: 192,
      ATARI_STARTHEIGHT:75,
      SCREEN_WIDTH_PER: 8,
      SCREEN_HEIGHT_PER: 5,
      MULTICOLOR: false,
      DOWNLOADS:{
        "bas": {file:"abb48mono.bas",action:(file)=>{download(file,code48pxBBWrap());}},
        "asm": {file:"abb.asm",action:(file)=>{download(file,code48pxMonoASM());}}
      },
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
      DOWNLOADS:{
        "bas": {file:"abb48color.bas",action:(file)=>{download(file,code48pxBBWrap());}},
        "asm": {file:"abb.asm",action:(file)=>{download(file,code48pxColorASM());}}
      },      
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
      DOWNLOADS:{
        "bas": {file:"abbPFbB.bas",action:(file)=>{download(file,codeBBpfColors());}}
      },       
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
      DOWNLOADS:{
        "bas": {file:"abbPFbBDPC.bas",action:(file)=>{download(file,codeBBpfDPC());}}
      },     
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
      DOWNLOADS:{
        "asm": {file:"abbAssymRepeat.asm",action:(file)=>{download(file,codeASMpfAssymRepeated(currentScanlinesPer));}},
        "macro":{file:"macro.h",action:downloadMacro},
        "vcs":{file:"vcs.h",action:downloadVCS},
      },           
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
      DOWNLOADS:{
        "asm": {file:"abbAssymMirror.asm",action:(file)=>{download(file,codeASMpfAssymMirrored(currentScanlinesPer));}},
        "macro":{file:"macro.h",action:downloadMacro},
        "vcs":{file:"vcs.h",action:downloadVCS}
      },
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
      DOWNLOADS:{
        "asm": {file:"abbSymMirror.asm",action:(file)=>{download(file,codeASMpfSymMirrored(currentScanlinesPer));}},
        "macro":{file:"macro.h",action:downloadMacro},
        "vcs":{file:"vcs.h",action:downloadVCS}
      },      
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
      DOWNLOADS:{
        "asm": {file:"abbSymRepeated.asm",action:(file)=>{download(file,codeASMpfSymRepeated(currentScanlinesPer));}},
        "macro":{file:"macro.h",action:downloadMacro},
        "vcs":{file:"vcs.h",action:downloadVCS}
      },
      NAME:'ASM Symmetrical (Repeated) color',
      DESCRIPTION: 'Assembly Symmetrical Playfield (Repeated) kernel, per scanline color change.',
      PIXDUP: 'repeat',
      LINEHEIGHTS: true
    },        

    bBTitle_48x2: {
      ATARI_WIDTH: 40,
      ATARI_MAXHEIGHT: 85,
      ATARI_STARTHEIGHT:50,
      SCREEN_WIDTH_PER: 10,
      SCREEN_HEIGHT_PER: 10,
      MULTICOLOR: true,
      DOWNLOADS:{
        "zip": {file:"titlescreen_kernel_1.8.zip", action:()=>{downloadFile('aux/titlescreen_kernel_1.8.zip')}},
        "bas": {file:"48x2mini.bas",action:(file)=>{download(file,simplebBTSKbas());}},
        "asm": {caption:"download titlescreen/text48x2_1_image.asm", file:"48x2_1_image.asm",action:(file)=>{download(file,codeASMbBTitle_48x2());}},
        "layout":{caption:"download titlescreen/titlescreen_layout.asm", file:"titlescreen_layout.asm",action:(file)=>{download(file,titlescreenLayout('draw_48x2_1'));}},
        "color":{caption:"download titlescreen/color.asm", file:"titlescreen_color.asm",action:(file)=>{download(file,titlescreenColor());}}
      }, 
      NAME:'bB Titlescreen (mini)Kernel: 48x2',
      DESCRIPTION: 'Mini-Kernel to be inserted into titlescreen_kernel_1.8/titlescreen',
    }

    
  }

 