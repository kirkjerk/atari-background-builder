function downloadMacro(){
  download('macro.h',getMACRO());
}
function downloadVCS(){
  download('vcs.h',getVCS());
}
function downloadFileNow(url) {
  const a = document.createElement('a');
  a.href = url;
  a.download = url.split('/').pop();
  console.log('DOWNLOADING',a.download);
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function getMiniNum(){
  return document.getElementById('mininum').value;
}

function getMiniNumFilename(file){
  const num = getMiniNum();
  return file.replace('?',num);
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

    bBTitle_48x1: {
      ATARI_WIDTH: 48,
      ATARI_MAXHEIGHT: 85,
      ATARI_STARTHEIGHT:50,
      SCREEN_WIDTH_PER: 10,
      SCREEN_HEIGHT_PER: 5,
      MULTICOLOR: false,
      MININUM: true,
      DOWNLOADS:{
        "zip": {file:"titlescreen_kernel_1.8.zip", action:()=>{downloadFileNow('./aux/titlescreen_kernel_1.8.zip')}},
        "bas": {file:"48x1_?_miniexample.bas",action:(file)=>{download(getMiniNumFilename(file),simplebBTSKbas());}},
        "asm": {caption:"download titlescreen/text48x1_?_image.asm", file:"48x1_?_image.asm",action:(file)=>{download(getMiniNumFilename(file),codeASMbBTitle_48x1());}},
        "layout":{caption:"download titlescreen/titlescreen_layout.asm", file:"titlescreen_layout.asm",action:(file)=>{download(file,titlescreenLayout(`draw_48x1_${getMiniNum()}`));}},
        "color":{caption:"download titlescreen/titlescreen_color.asm", file:"titlescreen_color.asm",action:(file)=>{download(file,titlescreenColor());}}
      }, 
      NAME:'bB Titlescreen (mini)Kernel: 48x1',
      DESCRIPTION: '48 pixel, 1-line mini-kernel to be inserted in titlescreen zip contents.',
    },

    bBTitle_48x2: {
      ATARI_WIDTH: 48,
      ATARI_MAXHEIGHT: 85,
      ATARI_STARTHEIGHT:50,
      SCREEN_WIDTH_PER: 10,
      SCREEN_HEIGHT_PER: 10,
      MULTICOLOR: true,
      MININUM: true,
      DOWNLOADS:{
        "zip": {file:"titlescreen_kernel_1.8.zip", action:()=>{downloadFileNow('./aux/titlescreen_kernel_1.8.zip')}},
        "bas": {file:"48x2_?_miniexample.bas",action:(file)=>{download(getMiniNumFilename(file),simplebBTSKbas());}},
        "asm": {caption:"download titlescreen/text48x2_?_image.asm", file:"48x2_?_image.asm",action:(file)=>{download(getMiniNumFilename(file),codeASMbBTitle_48x2());}},
        "layout":{caption:"download titlescreen/titlescreen_layout.asm", file:"titlescreen_layout.asm",action:(file)=>{download(file,titlescreenLayout(`draw_48x2_${getMiniNum()}`));}},
        "color":{caption:"download titlescreen/titlescreen_color.asm", file:"titlescreen_color.asm",action:(file)=>{download(file,titlescreenColor());}}
      }, 
      NAME:'bB Titlescreen (mini)Kernel: 48x2',
      DESCRIPTION: '48 pixel, 2-line color mini-kernel to be inserted in titlescreen zip contents.',
    },

    bBTitle_96x2: {
      ATARI_WIDTH: 96,
      ATARI_MAXHEIGHT: 85,
      ATARI_STARTHEIGHT:50,
      SCREEN_WIDTH_PER: 7,
      SCREEN_HEIGHT_PER: 7,
      MULTICOLOR: true,
      MININUM: true,
      DOWNLOADS:{
        "zip": {file:"titlescreen_kernel_1.8.zip", action:()=>{downloadFileNow('./aux/titlescreen_kernel_1.8.zip')}},
        "bas": {file:"96x2_?_miniexample.bas",action:(file)=>{download(getMiniNumFilename(file),simplebBTSKbas());}},
        "asm": {caption:"download titlescreen/text96x2_?_image.asm", file:"96x2_?_image.asm",action:(file)=>{download(getMiniNumFilename(file),codeASMbBTitle_96x2());}},
        "layout":{caption:"download titlescreen/titlescreen_layout.asm", file:"titlescreen_layout.asm",action:(file)=>{download(file,titlescreenLayout(`draw_96x2_${getMiniNum()}`));}},
        "color":{caption:"download titlescreen/titlescreen_color.asm", file:"titlescreen_color.asm",action:(file)=>{download(file,titlescreenColor());}}
      }, 
      NAME:'bB Titlescreen (mini)Kernel: 96x2',
      DESCRIPTION: '96 pixel, 2-line color mini-kernel to be inserted in titlescreen zip contents.',
    }

    
  }

 