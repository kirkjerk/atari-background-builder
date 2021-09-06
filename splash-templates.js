
function code48pxBBWrap() {
   return `   set romsize 4k
   const logo_color=$${currentFGColor}
   const logo_height=${H}
   COLUBK=$${currentBGColor}      

   playfield:
   .X...X.XXXXX.X.....X......XXX...
   .X...X.X.....X.....X.....X...X..
   .XXXXX.XXX...X.....X.....X...X..
   .X...X.X.....X.....X.....X...X..
   .X...X.XXXXX.XXXXX.XXXXX..XXX...
   ................................
   X.....X..XXX..XXXXX.X.....XXXX..
   X.....X.X...X.X...X.X.....X...X.
   X..X..X.X...X.XXXXX.X.....X...X.
   .X.X.X..X...X.X..X..X.....X...X.
   ..X.X....XXX..X...X.XXXXX.XXXX..
end

SubTitleLoop
   if joy0fire then goto SubMainLoop
   gosub drawlogo
   goto SubTitleLoop

SubMainLoop
   COLUPF=$${currentFGColor}
   drawscreen
   goto SubMainLoop

   inline abb.asm
`;


}



function code48pxMonoASM() {
   const block = make48pxblocks();
   return `
LogoFrame
; Enable VBLANK
	lda #2
    sta VBLANK
	sta VSYNC
	lda #26
	sta TIM8T
LogoWaitVSync
	lda INTIM
	bne LogoWaitVSync
	sta WSYNC                   ; 3     (0)
	sta VSYNC                   ; 3     (3)

; 37 lines of VBLANK
	lda #44                     ; 2     (5)
	sta TIM64T                  ; 3     (8)
    sleep 5                     ; 5     (13)
	lda #1                      ; 2     (15)
	sta VDELP0                  ; 3     (18)
	sta VDELP1                  ; 3     (21)
	lda #$A6                    ; 2     (23)
    sta COLUPF                  ; 3     (26)
    sleep 10                    ; 10    (36)
	sta RESP0                   ; 3     (39)
	sta RESP1                   ; 3     (42)
	lda #$20                    ; 2     (44)
	sta HMP1                    ; 2     (47)
    lda #$10                    ; 2     (49)
    sta HMP0                    ; 3     (52)
	lda #$33                    ; 2     (54)
	sta NUSIZ0                  ; 3     (57)
	STA NUSIZ1                  ; 3     (60)
	sta WSYNC
	sta HMOVE
	lda #logo_color
	sta COLUP0
	sta COLUP1
	
	
LogoWaitVBlank
	lda INTIM
	bne LogoWaitVBlank	; loop until timer expires
	sta WSYNC

; disable VBLANK
	lda #0
        sta VBLANK

; waste 51 scanlines
;	ldx #51
    ldx #(96 - (logo_height/2))
LogoVisibleScreen
    sta WSYNC
	dex
	bne LogoVisibleScreen



    ; Blank Screen and Set Playfield

    ldy #logo_height
    dey
    
LogoLoop
    sta WSYNC                       ; 3     (0)
    sty temp1                       ; 3     (3)
    lda logo_0,y                   ; 4     (7)
    sta GRP0                        ; 3     (10) 0 -> [GRP0]
    lda logo_1,y                   ; 4     (14)
    sta GRP1                        ; 3     (17) 1 -> [GRP1] ; 0 -> GRP0
    lda logo_2,y                   ; 4     (21)
    sta GRP0                        ; 3     (24*) 2 -> [GRP0] ; 1 -> GRP1
    ldx logo_4,y                   ; 4     (28) 4 -> X
    lda logo_5,y                   ; 4     (32)
    sta temp2                       ; 3     (35)
    lda logo_3,y                   ; 4     (39) 3 -> A
    ldy temp2                       ; 3     (42) 5 -> Y
    sta GRP1                        ; 3     (45) 3 -> [GRP1] ; 2 -> GRP0
    stx GRP0                        ; 3     (48) 4 -> [GRP0] ; 3 -> GRP1
    sty GRP1                        ; 3     (51) 5 -> [GRP1] ; 4 -> GRP0
    sta GRP0                        ; 3     (54) 5 -> GRP1
    ldy temp1                       ; 3     (57)
    dey                             ; 2     (59)
    bpl LogoLoop                    ; 3     (62)
    
    ldy #0
    sty GRP0
    sty GRP1
    sty GRP0
    sty GRP1
;	ldx #40
    ldx #((96 - (logo_height/2))-1)
LogoGap
    sta WSYNC
	dex                         ; 2     (2)
	bne LogoGap                 ; 2     (4)

LogoOverscanStart
; Enable VBLANK
	lda #2
        sta VBLANK
; overscan
	ldx #35
	stx TIM64T
	lda INTIM
	clc
	adc #128
	sta TIM64T
	rts

.drawlogo
	lda INTIM
	bmi .drawlogo	; loop until timer expires
	jmp LogoFrame


   if >. != >[.+(logo_height)]
      align 256
   endif

; Paste image information here

logo_0
${block[0]}

   if >. != >[.+(logo_height)]
      align 256
   endif

logo_1
${block[1]}

   if >. != >[.+(logo_height)]
      align 256
   endif

logo_2
${block[2]}

   if >. != >[.+(logo_height)]
      align 256
   endif

logo_3
${block[3]}

   if >. != >[.+(logo_height)]
      align 256
   endif

logo_4
${block[4]}

   if >. != >[.+(logo_height)]
      align 256
   endif

logo_5
${block[5]}

    `;
}






function code48pxColorASM() {
   const block = make48pxblocks();

   let colorblock = makeColorBytes();

   return `LogoFrame
; Enable VBLANK
	lda #2
    sta VBLANK
	sta VSYNC
	lda #26
	sta TIM8T
LogoWaitVSync
	lda INTIM
	bne LogoWaitVSync
	sta WSYNC                   ; 3     (0)
	sta VSYNC                   ; 3     (3)

; 37 lines of VBLANK
	lda #44                     ; 2     (5)
	sta TIM64T                  ; 3     (8)
    sleep 5                     ; 5     (13)
	lda #1                      ; 2     (15)
	sta VDELP0                  ; 3     (18)
	sta VDELP1                  ; 3     (21)
	lda #$A6                    ; 2     (23)
    sta COLUPF                  ; 3     (26)
    sleep 10                    ; 10    (36)
	sta RESP0                   ; 3     (39)
	sta RESP1                   ; 3     (42)
	lda #$20                    ; 2     (44)
	sta HMP1                    ; 2     (47)
    lda #$10                    ; 2     (49)
    sta HMP0                    ; 3     (52)
	lda #$33                    ; 2     (54)
	sta NUSIZ0                  ; 3     (57)
	STA NUSIZ1                  ; 3     (60)
	sta WSYNC
	sta HMOVE
	lda #logo_color
	sta COLUP0
	sta COLUP1
	
	
LogoWaitVBlank
	lda INTIM
	bne LogoWaitVBlank	; loop until timer expires
	sta WSYNC

; disable VBLANK
	lda #0
        sta VBLANK

; waste 51 scanlines
;	ldx #51
    ldx #(96 - (logo_height/2))
LogoVisibleScreen
    sta WSYNC
	dex
	bne LogoVisibleScreen



    ; Blank Screen and Set Playfield

    ldy #logo_height-1
    lda logo_colors,y
    sta COLUP0
    sta COLUP1
    
LogoLoop
    sta WSYNC                       ; 3     (0)
    sty temp1                       ; 3     (3)
    lda logo_0,y                   ; 4     (7)
    sta GRP0                        ; 3     (10) 0 -> [GRP0]
    lda logo_1,y                   ; 4     (14)
    sta GRP1                        ; 3     (17) 1 -> [GRP1] ; 0 -> GRP0
    lda logo_2,y                   ; 4     (21)
    sta GRP0                        ; 3     (24*) 2 -> [GRP0] ; 1 -> GRP1
    ldx logo_4,y                   ; 4     (28) 4 -> X
    lda logo_5,y                   ; 4     (32)
    sta temp2                       ; 3     (35)
    lda logo_3,y                   ; 4     (39) 3 -> A
    ldy temp2                       ; 3     (42) 5 -> Y
    sta GRP1                        ; 3     (45) 3 -> [GRP1] ; 2 -> GRP0
    stx GRP0                        ; 3     (48) 4 -> [GRP0] ; 3 -> GRP1
    sty GRP1                        ; 3     (51) 5 -> [GRP1] ; 4 -> GRP0
    sta GRP0                        ; 3     (54) 5 -> GRP1
    ldy temp1                       ; 3     (57)
    lda logo_colors-1,y               ; 4     (61)
    sta COLUP0                      ; 3     (64)
    sta COLUP1                      ; 3     (67)
    dey                             ; 2     (69)
    bpl LogoLoop                    ; 3     (72)
    
    ldy #0
    sty GRP0
    sty GRP1
    sty GRP0
    sty GRP1
;	ldx #40
    ldx #((96 - (logo_height/2))-1)
LogoGap
    sta WSYNC
	dex                         ; 2     (2)
	bne LogoGap                 ; 2     (4)

LogoOverscanStart
; Enable VBLANK
	lda #2
        sta VBLANK
; overscan
	ldx #35
	stx TIM64T
	lda INTIM
	clc
	adc #128
	sta TIM64T
	rts

.drawlogo
	lda INTIM
	bmi .drawlogo	; loop until timer expires
	jmp LogoFrame


   if >. != >[.+(logo_height)]
      align 256
   endif

; Paste image information here

logo_0
${block[0]}

   if >. != >[.+(logo_height)]
      align 256
   endif

logo_1
${block[1]}

   if >. != >[.+(logo_height)]
      align 256
   endif

logo_2
${block[2]}

   if >. != >[.+(logo_height)]
      align 256
   endif

logo_3
${block[3]}

   if >. != >[.+(logo_height)]
      align 256
   endif

logo_4
${block[4]}

   if >. != >[.+(logo_height)]
      align 256
   endif

logo_5
${block[5]}

   if >. != >[.+(logo_height)]
      align 256
   endif

logo_colors
${colorblock}
    
`;
}
function codeBBpfColors() {
   const pixelblock = getBBPixelBlock();
   const colorblock = getBBColorBlock(colorGrid, '0E');

   return `    set kernel_options pfcolors 
startLoop

    COLUBK=$${currentBGColor}      

      playfield:
${pixelblock}end 

  pfcolors:
${colorblock}end

 drawscreen
 goto startLoop  
 `;
}


function codeBBpfDPC(fracincPixels, fracincColors, comment) {
   const pixelblock = getBBPixelBlock();
   const colorblock = getBBColorBlock(colorGrid, '0E');
   const bkcolor = getBBColorBlock(colorBgGrid, '00');
   return `   set kernel DPC+

   
   dim _Bit0_Reset_Restrainer = y
   dim _Bit7_Flip_Scroll = y

   goto __Bank_2 bank2

   bank 2
   temp1=temp1

__Bank_2

__Start_Restart

   drawscreen
   pfclear
   AUDV0 = 0 : AUDV1 = 0
   a = 0 : b = 0 : c = 0 : d = 0 : e = 0 : f = 0 : g = 0 : h = 0 : i = 0
   j = 0 : k = 0 : l = 0 : m = 0 : n = 0 : o = 0 : p = 0 : q = 0 : r = 0
   s = 0 : t = 0 : u = 0 : v = 0 : w = 0 : x = 0 : y = 0 : z = 0
   var0 = 0 : var1 = 0 : var2 = 0 : var3 = 0 : var4 = 0
   var5 = 0 : var6 = 0 : var7 = 0 : var8 = 0


   playfield:
   ${pixelblock}end 
   
     pfcolors:
   ${colorblock}end

   ;***************************************************************
   ;
   ;  Background colors.
   ;
   bkcolors:
${bkcolor}end

   ;************************************************************
   _Bit0_Reset_Restrainer{0} = 1


__Main_Loop

   ;***************************************************************
   ;
   ;  ${comment}
   ;
   DF6FRACINC = ${fracincColors} ; Background colors.
   DF4FRACINC = ${fracincColors} ; Playfield colors.

   DF0FRACINC = ${fracincPixels} ; Column 0.
   DF1FRACINC = ${fracincPixels} ; Column 1.
   DF2FRACINC = ${fracincPixels} ; Column 2.
   DF3FRACINC = ${fracincPixels} ; Column 3.

   drawscreen


   if !switchreset then _Bit0_Reset_Restrainer{0} = 0 : goto __Main_Loop

   if _Bit0_Reset_Restrainer{0} then goto __Main_Loop

   goto __Start_Restart



   bank 3
   temp1=temp1



   bank 4
   temp1=temp1



   bank 5
   temp1=temp1



   bank 6
   temp1=temp1
`;
}



function getBBPixelBlock() {
   let pixelblock = '';
   for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
         pixelblock += yxGrid[y][x] ? 'X' : '.';
      }
      pixelblock += '\n';
   }
   return pixelblock;
}
function getBBColorBlock(grid, colorIfNull) {
   let colorblock = '';

   for (let y = 0; y < H; y++) {
      const colorbyte = grid[y] ? grid[y] : colorIfNull;
      colorblock += `   $${colorbyte}\n`
   }
   return colorblock;
}


function makeColorBytes() { //reverse order
   let colorblock = '';
   for (let y = H - 1; y >= 0; y--) {
      const colorbyte = colorGrid[y] ? colorGrid[y] : '0E';
      colorblock += `   .byte $${colorbyte}\n`
   }
   return colorblock;
}


function getByteBuff(line, start, length, prefix, on, off) {
   let buf = prefix;
   const increment = length / abs(length); //i.e. 1 or -1


   let x = start;
   for (let c = 0; c < abs(length); c++) {
      buf += line[x] ? on : off;
      x += increment;
   }
   if (abs(length) < 8) { //pad with zeros
      buf += '0'.repeat(8 - abs(length));
   }
   buf += '\n';
   return buf;
}

function make48pxblocks() {
   //we have 6 blocks, one for each section...	
   const block = ['', '', '', '', '', ''];
   for (let y = H - 1; y >= 0; y--) {
      for (let p = 0; p < 6; p++) {
         block[p] += getByteBuff(yxGrid[y], p * 8, 8, '	BYTE %', '1', '0');
      }
   }
   return block;
}

function make96pxblocks() {
   //we have 12 blocks, one for each section...	
   const block = ['', '', '', '', '', '', '', '', '', '', '', ''];
   for (let y = H - 1; y >= 0; y--) {
      for (let p = 0; p < 12; p++) {
         block[p] += getByteBuff(yxGrid[y], p * 8, 8, '	BYTE %', '1', '0');
      }
   }
   return block;
}

// get the bits from start to stop, INCLUSIVE
//if start is bigger than stop, will be in reverse order
//if less than 8 will be right padded with 0s
function makeColumnBlock(start, stop) {
   const length = (stop - start) - ((start > stop) ? 1 : -1);
   let buf = '';
   for (let y = H - 1; y >= 0; y--) {
      buf += getByteBuff(yxGrid[y], start, length, '	.byte %', '1', '0');
   }
   return buf;
}

function codeASMpfAssymRepeated(playfield_line_height) {
   const PFColors = makeColorBytes();
   const PF0DataA = makeColumnBlock(3, 0);
   const PF1DataA = makeColumnBlock(4, 11);
   const PF2DataA = makeColumnBlock(19, 12);
   const PF0DataB = makeColumnBlock(23, 20);
   const PF1DataB = makeColumnBlock(24, 31);
   const PF2DataB = makeColumnBlock(39, 32);

   return `    processor 6502
    include "vcs.h"
    include "macro.h"
    SEG.U VARS
    ORG $80

; $80
Temp                        ds 1
PlayFieldHeightCounter      ds 1
PlayFieldLinesCounter       ds 1

kernel_lines=192
playfield_lines=${H}
playfield_line_height=${playfield_line_height}
padding_lines=1

playfield_scanlines=#playfield_lines*#playfield_line_height
remaining_lines=#kernel_lines-#playfield_scanlines-#padding_lines-2


NO_ILLEGAL_OPCODES = 0


   SEG CODE
   ORG $F000
Start:
   CLEAN_START

; Repeating playfield is default with clean start
;   lda #1
;   sta CTRLPF   ; Mirrored playfield

NextFrame

	VERTICAL_SYNC
    lda #44
    sta TIM64T

; My VBLANK code


    
    
WaitVBlank
    lda INTIM
    bne WaitVBlank ; loop until timer expires
    sta WSYNC
    sta VBLANK

    ldx #padding_lines
PaddingLoop
    sta WSYNC
    dex
    bne PaddingLoop

    ldx #playfield_lines-1
    lda #playfield_line_height
    sta PlayFieldHeightCounter


PlayfieldLoop
    sta WSYNC                       ; 3     (0)
    lda PFColors,x                  ; 4     (4)
    sta COLUPF                      ; 3     (7)
    lda PF0DataA,x                  ; 4     (11)
    sta PF0                         ; 3     (14)
    lda PF1DataA,x                  ; 4     (18)
    sta PF1                         ; 3     (21)
    lda PF2DataA,x                  ; 4     (25*)
    sta PF2                         ; 3     (28)
    lda PF0DataB,x                  ; 4     (32)
    tay                             ; 2     (34)
    lda PF1DataB,x                  ; 4     (38)
    sta PF1                         ; 3     (41)
    sty PF0                         ; 3     (44)
    lda PF2DataB,x                  ; 4     (48)
Check0
    sta PF2                         ; 3     (51)
    dec PlayFieldHeightCounter      ; 5     (56)
    bne ____skip_new_row            ; 2/3   (58/59)
    lda #playfield_line_height      ; 2     (60)
    sta PlayFieldHeightCounter      ; 3     (63)
    dex                             ; 2     (65)
    cpx #$FF                        ; 2     (67)
    beq ____done_playfield_rows     ; 2/3   (69)
____skip_new_row
    jmp PlayfieldLoop               ; 3     (72)



____done_playfield_rows
    lda #0
    sta PF0
    sta PF1
    sta PF2
    ldx #remaining_lines
VisibleScreen
    sta WSYNC
    dex
    bne VisibleScreen
    
SetupOS
    lda #36
    sta TIM64T
    lda #2
    sta WSYNC
    sta VBLANK



            
WaitOverscan
    lda INTIM
    bne WaitOverscan
    sta WSYNC
    
    jmp NextFrame

   if >. != >[.+(playfield_lines)]
      align 256
   endif

PF0DataA
${PF0DataA}
    

   if >. != >[.+(playfield_lines)]
      align 256
   endif

PF1DataA
${PF1DataA}


   if >. != >[.+(playfield_lines)]
      align 256
   endif

PF2DataA
${PF2DataA}
    
   if >. != >[.+(playfield_lines)]
      align 256
   endif

PF0DataB
${PF0DataB}
    

   if >. != >[.+(playfield_lines)]
      align 256
   endif

PF1DataB
${PF1DataB}


   if >. != >[.+(playfield_lines)]
      align 256
   endif

PF2DataB
${PF2DataB}
    

   if >. != >[.+(playfield_lines)]
      align 256
   endif

PFColors
${PFColors}

    ECHO ([$FFFC-.]d), "bytes free"

    org $fffc
    .word Start
    .word Start

`;

}



function codeASMpfAssymMirrored(playfield_line_height) {
   const PFColors = makeColorBytes();
   const PF0DataA = makeColumnBlock(3, 0);
   const PF1DataA = makeColumnBlock(4, 11);
   const PF2DataA = makeColumnBlock(19, 12);
   const PF0DataB = makeColumnBlock(36, 39);
   const PF1DataB = makeColumnBlock(35, 28);
   const PF2DataB = makeColumnBlock(20, 27);

   return `
   processor 6502
   include "vcs.h"
   include "macro.h"
   SEG.U VARS
   ORG $80

; $80
Temp                        ds 1
PlayFieldHeightCounter      ds 1
PlayFieldLinesCounter       ds 1

kernel_lines=192
playfield_lines=${H}
playfield_line_height=${playfield_line_height}
padding_lines=1

playfield_scanlines=#playfield_lines*#playfield_line_height
remaining_lines=#kernel_lines-#playfield_scanlines-#padding_lines+2


NO_ILLEGAL_OPCODES = 0


  SEG CODE
  ORG $F000
Start:
  CLEAN_START

  lda #1
  sta CTRLPF   ; Mirrored playfield

NextFrame

  VERTICAL_SYNC
   lda #44
   sta TIM64T

; My VBLANK code


   
   
WaitVBlank
   lda INTIM
   bne WaitVBlank ; loop until timer expires
   sta WSYNC
   sta VBLANK

   ldx #padding_lines
PaddingLoop
   sta WSYNC
   dex
   bne PaddingLoop

   ldx #playfield_lines-1
   lda #playfield_line_height
   sta PlayFieldHeightCounter


PlayfieldLoop
   sta WSYNC                       ; 3     (0)
   lda PFColors,x                  ; 4     (4)
   sta COLUPF                      ; 3     (7)
   lda PF0DataA,x                  ; 4     (11)
   sta PF0                         ; 3     (14)
   lda PF1DataA,x                  ; 4     (18)
   sta PF1                         ; 3     (21)
   lda PF2DataA,x                  ; 4     (25*)
   sta PF2                         ; 3     (28)
   lda PF2DataB,x                  ; 4     (32)
   tay                             ; 2     (34)
   lda PF1DataB,x                  ; 4     (38)
   sta PF1                         ; 3     (41)
   lda PF0DataB,x                  ; 4     (45)
   sty PF2                         ; 3     (48)
   sta PF0                         ; 3     (51)
   dec PlayFieldHeightCounter      ; 5     (56)
   bne ____skip_new_row            ; 2/3   (58/59)
   lda #playfield_line_height      ; 2     (60)
   sta PlayFieldHeightCounter      ; 3     (63)
   dex                             ; 2     (65)
   beq ____done_playfield_rows     ; 2/3   (67)
____skip_new_row
   jmp PlayfieldLoop               ; 3     (70)



____done_playfield_rows
   lda #0
   sta PF0
   sta PF1
   sta PF2
   ldx #remaining_lines
VisibleScreen
   sta WSYNC
   dex
   bne VisibleScreen
   
SetupOS
   lda #36
   sta TIM64T
   lda #2
   sta WSYNC
   sta VBLANK



           
WaitOverscan
   lda INTIM
   bne WaitOverscan
   sta WSYNC
   
   jmp NextFrame

  if >. != >[.+(playfield_lines)]
     align 256
  endif

PF0DataA
${PF0DataA}

  if >. != >[.+(playfield_lines)]
     align 256
  endif

PF1DataA
${PF1DataA}

  if >. != >[.+(playfield_lines)]
     align 256
  endif

PF2DataA
${PF2DataA}


  if >. != >[.+(playfield_lines)]
     align 256
  endif

PF0DataB
${PF0DataB}


  if >. != >[.+(playfield_lines)]
     align 256
  endif

PF1DataB
${PF1DataB}

  if >. != >[.+(playfield_lines)]
     align 256
  endif

PF2DataB
${PF2DataB}

  if >. != >[.+(playfield_lines)]
     align 256
  endif

PFColors
${PFColors}


   ECHO ([$FFFC-.]d), "bytes free"

   org $fffc
   .word Start
   .word Start


   `;
}

function codeASMpfSymMirrored(playfield_line_height) {
   const PFColors = makeColorBytes();
   const PF0DataA = makeColumnBlock(3, 0);
   const PF1DataA = makeColumnBlock(4, 11);
   const PF2DataA = makeColumnBlock(19, 12);

   return `    processor 6502
    include "vcs.h"
    include "macro.h"
    SEG.U VARS
    ORG $80

; $80
Temp                        ds 1
PlayFieldHeightCounter      ds 1
PlayFieldLinesCounter       ds 1

kernel_lines=192
playfield_lines=${H}
playfield_line_height=${playfield_line_height}
padding_lines=1

playfield_scanlines=#playfield_lines*#playfield_line_height
remaining_lines=#kernel_lines-#playfield_scanlines-#padding_lines+3


NO_ILLEGAL_OPCODES = 0


   SEG CODE
   ORG $F000
Start:
   CLEAN_START

   lda #1
   sta CTRLPF   ; Mirrored playfield

NextFrame

	VERTICAL_SYNC
    lda #44
    sta TIM64T

; My VBLANK code


    
    
WaitVBlank
    lda INTIM
    bne WaitVBlank ; loop until timer expires
    sta WSYNC
    sta VBLANK

    ldx #padding_lines
PaddingLoop
    sta WSYNC
    dex
    bne PaddingLoop

    ldx #playfield_lines-1
    lda #playfield_line_height
    sta PlayFieldHeightCounter


PlayfieldLoop
    sta WSYNC                       ; 3     (0)
    lda PFColors,x                  ; 4     (4)
    sta COLUPF                      ; 3     (7)
    lda PF0DataA,x                  ; 4     (11)
    sta PF0                         ; 3     (14)
    lda PF1DataA,x                  ; 4     (18)
    sta PF1                         ; 3     (21)
    lda PF2DataA,x                  ; 4     (25*)
    sta PF2                         ; 3     (28)
    dec PlayFieldHeightCounter      ; 5     (56)
    bne ____skip_new_row            ; 2/3   (58/59)
    lda #playfield_line_height      ; 2     (60)
    sta PlayFieldHeightCounter      ; 3     (63)
    dex                             ; 2     (65)
    beq ____done_playfield_rows     ; 2/3   (67)
____skip_new_row
    jmp PlayfieldLoop               ; 3     (70)



____done_playfield_rows
    lda #0
    sta PF0
    sta PF1
    sta PF2
    ldx #remaining_lines
VisibleScreen
    sta WSYNC
    dex
    bne VisibleScreen
    
SetupOS
    lda #36
    sta TIM64T
    lda #2
    sta WSYNC
    sta VBLANK



            
WaitOverscan
    lda INTIM
    bne WaitOverscan
    sta WSYNC
    
    jmp NextFrame

   if >. != >[.+(playfield_lines)]
      align 256
   endif

PF0DataA
${PF0DataA}

   if >. != >[.+(playfield_lines)]
      align 256
   endif

PF1DataA
${PF1DataA}

   if >. != >[.+(playfield_lines)]
      align 256
   endif

PF2DataA
${PF2DataA}

   if >. != >[.+(playfield_lines)]
      align 256
   endif

PFColors
${PFColors}

    ECHO ([$FFFC-.]d), "bytes free"

    org $fffc
    .word Start
    .word Start
`;
}


function codeASMpfSymRepeated(playfield_line_height) {
   const PFColors = makeColorBytes();
   const PF0DataA = makeColumnBlock(3, 0);
   const PF1DataA = makeColumnBlock(4, 11);
   const PF2DataA = makeColumnBlock(19, 12);

   return `    processor 6502
    include "vcs.h"
    include "macro.h"
    SEG.U VARS
    ORG $80

; $80
Temp                        ds 1
PlayFieldHeightCounter      ds 1
PlayFieldLinesCounter       ds 1

kernel_lines=192
playfield_lines=${H}
playfield_line_height=${playfield_line_height}
padding_lines=1

playfield_scanlines=#playfield_lines*#playfield_line_height
remaining_lines=#kernel_lines-#playfield_scanlines-#padding_lines+3


NO_ILLEGAL_OPCODES = 0


   SEG CODE
   ORG $F000
Start:
   CLEAN_START

;   lda #1
;   sta CTRLPF   ; Mirrored playfield

NextFrame

	VERTICAL_SYNC
    lda #44
    sta TIM64T

; My VBLANK code


    
    
WaitVBlank
    lda INTIM
    bne WaitVBlank ; loop until timer expires
    sta WSYNC
    sta VBLANK

    ldx #padding_lines
PaddingLoop
    sta WSYNC
    dex
    bne PaddingLoop

    ldx #playfield_lines-1
    lda #playfield_line_height
    sta PlayFieldHeightCounter


PlayfieldLoop
    sta WSYNC                       ; 3     (0)
    lda PFColors,x                  ; 4     (4)
    sta COLUPF                      ; 3     (7)
    lda PF0DataA,x                  ; 4     (11)
    sta PF0                         ; 3     (14)
    lda PF1DataA,x                  ; 4     (18)
    sta PF1                         ; 3     (21)
    lda PF2DataA,x                  ; 4     (25*)
    sta PF2                         ; 3     (28)
    dec PlayFieldHeightCounter      ; 5     (56)
    bne ____skip_new_row            ; 2/3   (58/59)
    lda #playfield_line_height      ; 2     (60)
    sta PlayFieldHeightCounter      ; 3     (63)
    dex                             ; 2     (65)
    beq ____done_playfield_rows     ; 2/3   (67)
____skip_new_row
    jmp PlayfieldLoop               ; 3     (70)



____done_playfield_rows
    lda #0
    sta PF0
    sta PF1
    sta PF2
    ldx #remaining_lines
VisibleScreen
    sta WSYNC
    dex
    bne VisibleScreen
    
SetupOS
    lda #36
    sta TIM64T
    lda #2
    sta WSYNC
    sta VBLANK



            
WaitOverscan
    lda INTIM
    bne WaitOverscan
    sta WSYNC
    
    jmp NextFrame

   if >. != >[.+(playfield_lines)]
      align 256
   endif

PF0DataA
${PF0DataA}

   if >. != >[.+(playfield_lines)]
      align 256
   endif

PF1DataA
${PF1DataA}

   if >. != >[.+(playfield_lines)]
      align 256
   endif

PF2DataA
${PF2DataA}

   if >. != >[.+(playfield_lines)]
      align 256
   endif

PFColors
${PFColors}

    ECHO ([$FFFC-.]d), "bytes free"

    org $fffc
    .word Start
    .word Start

`
};

function codeASMbBTitle_96x2() {
   const block = make96pxblocks();
   let colorblock = makeColorBytes();
   const mininum = getMiniNum();

   return `

 ;*** The height of the displayed data...
bmp_96x2_${mininum}_window = ${H}

 ;*** The height of the bitmap data. This can be larger than 
 ;*** the displayed data height, if you're scrolling or animating 
 ;*** the data...
bmp_96x2_${mininum}_height = ${H}


   if >. != >[.+(bmp_96x2_${mininum}_height)]
      align 256
   endif
   BYTE $00 ; leave this here!


  ;*** The color of each line in the bitmap, in reverse order...
bmp_96x2_${mininum}_colors 
${colorblock}

   if >. != >[.+(bmp_96x2_${mininum}_height)]
      align 256
   endif


bmp_96x2_${mininum}_00
 ; *** replace this block with your bimap_00 data block...
${block[0]}


   if >. != >[.+(bmp_96x2_${mininum}_height)]
      align 256
   endif


bmp_96x2_${mininum}_01
 ; *** replace this block with your bimap_01 data block...
${block[1]}


   if >. != >[.+(bmp_96x2_${mininum}_height)]
      align 256
   endif


bmp_96x2_${mininum}_02
 ; *** replace this block with your bimap_02 data block...
${block[2]}


   if >. != >[.+(bmp_96x2_${mininum}_height)]
      align 256
   endif


bmp_96x2_${mininum}_03
 ; *** replace this block with your bimap_03 data block...
${block[3]}


   if >. != >[.+(bmp_96x2_${mininum}_height)]
      align 256
   endif


bmp_96x2_${mininum}_04
 ; *** replace this block with your bimap_04 data block...
${block[4]}


   if >. != >[.+(bmp_96x2_${mininum}_height)]
      align 256
   endif


bmp_96x2_${mininum}_05
 ; *** replace this block with your bimap_05 data block...
${block[5]}


   if >. != >[.+(bmp_96x2_${mininum}_height)]
      align 256
   endif


bmp_96x2_${mininum}_06
 ; *** replace this block with your bimap_06 data block...
${block[6]}


   if >. != >[.+(bmp_96x2_${mininum}_height)]
      align 256
   endif


bmp_96x2_${mininum}_07
 ; *** replace this block with your bimap_07 data block...
${block[7]}


   if >. != >[.+(bmp_96x2_${mininum}_height)]
      align 256
   endif


bmp_96x2_${mininum}_08
 ; *** replace this block with your bimap_08 data block...
${block[8]}


   if >. != >[.+(bmp_96x2_${mininum}_height)]
      align 256
   endif


bmp_96x2_${mininum}_09
 ; *** replace this block with your bimap_09 data block...
${block[9]}


   if >. != >[.+(bmp_96x2_${mininum}_height)]
      align 256
   endif


bmp_96x2_${mininum}_${mininum}0
 ; *** replace this block with your bimap_10 data block...
${block[10]}


   if >. != >[.+(bmp_96x2_${mininum}_height)]
      align 256
   endif


bmp_96x2_${mininum}_${mininum}1
 ; *** replace this block with your bimap_11 data block...
${block[11]}

   `;
}
function codeASMbBTitle_48x1() {
   const block = make48pxblocks();
   const mininum = getMiniNum();

   return `
 ;*** The height of the displayed data...
bmp_48x1_${mininum}_window = ${H}

 ;*** The height of the bitmap data. This can be larger than 
 ;*** the displayed data height, if you're scrolling or animating 
 ;*** the data...
bmp_48x1_${mininum}_height = ${H}

 ifnconst bmp_48x1_${mininum}_PF1
bmp_48x1_${mininum}_PF1
 endif
        BYTE %00000000
 ifnconst bmp_48x1_${mininum}_PF2
bmp_48x1_${mininum}_PF2
 endif
        BYTE %00000000
 ifnconst bmp_48x1_${mininum}_background
bmp_48x1_${mininum}_background
 endif
        BYTE $c2

 ifnconst bmp_48x1_${mininum}_color
bmp_48x1_${mininum}_color
 endif
 ; *** this is the bitmap color. If you want to change it in a 
 ; *** variable instead, dim one in bB called "bmp_48x1_${mininum}_color"
	.byte $${currentFGColor}


   if >. != >[.+bmp_48x1_${mininum}_height]
	align 256
   endif

bmp_48x1_${mininum}_00
 ; *** replace this block with your bimap_00 data block...
${block[0]}


   if >. != >[.+bmp_48x1_${mininum}_height]
	align 256
   endif


bmp_48x1_${mininum}_01
 ; *** replace this block with your bimap_01 data block...
${block[1]}


   if >. != >[.+bmp_48x1_${mininum}_height]
	align 256
   endif


bmp_48x1_${mininum}_02
 ; *** replace this block with your bimap_02 data block...
 ${block[2]}


   if >. != >[.+bmp_48x1_${mininum}_height]
	align 256
   endif


bmp_48x1_${mininum}_03
 ; *** replace this block with your bimap_03 data block...
 ${block[3]}


   if >. != >[.+bmp_48x1_${mininum}_height]
	align 256
   endif


bmp_48x1_${mininum}_04
 ; *** replace this block with your bimap_04 data block...
 ${block[4]}


   if >. != >[.+bmp_48x1_${mininum}_height]
	align 256
   endif


bmp_48x1_${mininum}_05
 ; *** replace this block with your bimap_05 data block...
 ${block[5]}
   `
      ;
}
function codeASMbBTitle_48x2() {
   const block = make48pxblocks();
   let colorblock = makeColorBytes();
   const mininum = getMiniNum();

   return `

 ;*** The height of the displayed data...
bmp_48x2_${mininum}_window = ${H}

 ;*** The height of the bitmap data. This can be larger than 
 ;*** the displayed data height, if you're scrolling or animating 
 ;*** the data...
bmp_48x2_${mininum}_height = ${H}

   if >. != >[.+(bmp_48x2_${mininum}_height)]
      align 256
   endif
 BYTE 0 ; leave this here!


 ;*** The color of each line in the bitmap, in reverse order...
bmp_48x2_${mininum}_colors 
${colorblock}

   if >. != >[.+bmp_48x2_${mininum}_height]
      align 256
   endif


bmp_48x2_${mininum}_00
 ; *** replace this block with your bimap_00 data block...
${block[0]}

   if >. != >[.+bmp_48x2_${mininum}_height]
      align 256
   endif


bmp_48x2_${mininum}_01
 ; *** replace this block with your bimap_01 data block...
${block[1]}


   if >. != >[.+bmp_48x2_${mininum}_height]
      align 256
   endif


bmp_48x2_${mininum}_02
 ; *** replace this block with your bimap_02 data block...
${block[2]}


   if >. != >[.+bmp_48x2_${mininum}_height]
      align 256
   endif


bmp_48x2_${mininum}_03
 ; *** replace this block with your bimap_03 data block...
${block[3]}


   if >. != >[.+bmp_48x2_${mininum}_height]
      align 256
   endif


bmp_48x2_${mininum}_04
 ; *** replace this block with your bimap_04 data block...
${block[4]}


   if >. != >[.+bmp_48x2_${mininum}_height]
      align 256
   endif


bmp_48x2_${mininum}_05
 ; *** replace this block with your bimap_05 data block...
${block[5]}


`;
};




function simplebBTSKbas() {
   return `    set romsize 8k

; Since bB puts the display kernel in the last bank, we are putting
; the game logic there as well in order to free up bank 1 for
; titlescreen data and code.

    goto GameStart bank2

 asm
 include "titlescreen/asm/titlescreen.asm"
end

 bank 2

GameStart

TitleLoop
    gosub titledrawscreen bank1
    goto TitleLoop
`
}

function titlescreenColor() {
   return ` ; This is where the titlescreen background color gets set. 
 ; You can also do a "dim titlescreencolor=[letter]" in bB
 ; if you want to change the color on the fly.

 ifnconst titlescreencolor
titlescreencolor
 endif
 .byte $${currentBGColor}
   `;
}

function titlescreenLayout(which) {

   const typesRaw = `draw_96x2_1
draw_96x2_2
draw_96x2_3
draw_48x1_1
draw_48x1_2
draw_48x1_3
draw_48x2_1
draw_48x2_2
draw_48x2_3
draw_player
draw_gameselect
draw_space 2
draw_score`;

   const types = typesRaw.split('\n'); //I am so lazy
   //of all the types. comment them out except for the one matching which
   const buf = types.map((thing) => `${which == thing ? '' : ';'} ${thing}`).join('\n')

   return `
   ; To use a minikernel, just list it below. They'll be drawn on the screen in
   ; in the order they were listed.
   ;
   ; If a minikernel isn't listed, it won't be compiled into your program, and
   ; it won't use any rom space.
  
   MAC titlescreenlayout
${buf}
 ENDM
  
   ; minikernel choices are:
   ; 
   ; draw_48x1_1, draw_48x1_2, draw_48x1_3 
   ; 	The first, second, and third 48-wide single-line bitmap minikernels
   ;
   ; draw_48x2_1, draw_48x2_2, draw_48x2_3 
   ; 	The first, second, and third 48-wide double-line bitmap minikernels
   ;
   ; draw_96x2_1, draw_96x2_2, draw_96x2_3 
   ; 	The first, second, and third 96-wide double-line bitmap minikernels
   ;
   ; draw_gameselect
   ; 	The game selection display minikernel
   ;
   ; draw_score
   ;	A minikernel that draws the score
   ;
   ; draw_space 10
   ;	A minikernel used to add blank space between other minikernels
`;
}