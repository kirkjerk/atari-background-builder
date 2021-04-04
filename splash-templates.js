
function code48pxBBWrap(){
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

   inline splash.asm
`;


}



function code48pxMonoASM(){
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






function code48pxColorASM(){
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
   const colorblock = getBBColorBlock();

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


function codeBBpfDPC(){
   const pixelblock = getBBPixelBlock();
   const colorblock = getBBColorBlock();

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




   ;************************************************************
   _Bit0_Reset_Restrainer{0} = 1


__Main_Loop

   ;***************************************************************
   ;
   ;  88 rows that are 2 scanlines high.
   ;
   DF6FRACINC = 255 ; Background colors.
   DF4FRACINC = 255 ; Playfield colors.

   DF0FRACINC = 128 ; Column 0.
   DF1FRACINC = 128 ; Column 1.
   DF2FRACINC = 128 ; Column 2.
   DF3FRACINC = 128 ; Column 3.

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
   for(let y = 0; y < H; y++){
      for(let x = 0; x < W; x++){
         pixelblock += yxGrid[y][x]?'X':'.';
      }
      pixelblock += '\n';
   }
   return pixelblock;
}
function getBBColorBlock(){
   let colorblock = '';

   for(let y = 0; y < H; y++){
      colorblock += `   $${colorGrid[y]}\n`
   } 
   return colorblock;
}


function makeColorBytes(){ //reverse order
   let colorblock = '';
   for(let y = H-1; y >= 0; y--){
      colorblock += `   .byte $${colorGrid[y]}\n`
   }
   return colorblock;
}


function getByteBuff(line, start,length,prefix,on,off){
   let buf = prefix;
   const increment = length / abs(length); //i.e. 1 or -1


   let x = start;
   for(let c = 0; c < abs(length); c++) {
      console.log(`look at ${x}`);
      buf += line[x] ? on:off;
      x += increment;
   }
   if(abs(length) < 8) { //pad with zeros
      buf += '0'.repeat(8 - abs(length));
   }
   buf += '\n';
   return buf;   
}

function make48pxblocks(){
	//we have 6 blocks, one for each section...	
	const block = ['','','','','',''];
	for(let y = H - 1; y >= 0; y--){
	   for(let p = 0; p < 6; p++){
		  block[p] += getByteBuff(yxGrid[y], p*8,8,'	BYTE %','1','0');
	   }
	}
	return block;
}

// get the bits from start to stop, INCLUSIVE
//if start is bigger than stop, will be in reverse order
//if less than 8 will be right padded with 0s
function makeColumnBlock(start, stop){
   const length = (stop - start) - ((start > stop) ? 1 : -1);
   console.log({start,stop,length});
   let buf = '';
   for(let y = H - 1; y >= 0; y--){
      buf += getByteBuff(yxGrid[y], start,length,'	.byte %','1','0');
   }
   return buf;
}

function codeASMpfAssymRepeated(scanline){
   const PFColors = makeColorBytes();
   const PF0DataA = makeColumnBlock(3,0);
   const PF1DataA = makeColumnBlock(4,11);
   const PF2DataA = makeColumnBlock(19,12);
   const PF0DataB = makeColumnBlock(23,20);
   const PF1DataB = makeColumnBlock(24,31);
   const PF2DataB = makeColumnBlock(39,32);

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
playfield_line_height=1
padding_lines=10

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

    ldx #playfield_lines
    lda #playfield_line_height
    sta PlayFieldHeightCounter


PlayfieldLoop
    sta WSYNC                       ; 3     (0)
    lda PFColors-1,x                  ; 4     (4)
    sta COLUPF                      ; 3     (7)
    lda PF0DataA-1,x                  ; 4     (11)
    sta PF0                         ; 3     (14)
    lda PF1DataA-1,x                  ; 4     (18)
    sta PF1                         ; 3     (21)
    lda PF2DataA-1,x                  ; 4     (25*)
    sta PF2                         ; 3     (28)
    lda PF0DataB-1,x                  ; 4     (32)
    tay                             ; 2     (34)
    lda PF1DataB-1,x                  ; 4     (38)
    sta PF1                         ; 3     (41)
    lda PF2DataB-1,x                  ; 4     (45)
    sty PF0                         ; 3     (48)
    sta PF2                         ; 3     (51)
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




/**
 * 
 * STANDARD .H FILES PUT HERE FOR CONVENIENCE
 * 
 * 
 * */



function fileMACRO_H() { return `; MACRO.H
; Version 1.05, 13/NOVEMBER/2003

VERSION_MACRO         = 105

;
; THIS FILE IS EXPLICITLY SUPPORTED AS A DASM-PREFERRED COMPANION FILE
; PLEASE DO *NOT* REDISTRIBUTE MODIFIED VERSIONS OF THIS FILE!
;
; This file defines DASM macros useful for development for the Atari 2600.
; It is distributed as a companion machine-specific support package
; for the DASM compiler. Updates to this file, DASM, and associated tools are
; available at at http://www.atari2600.org/dasm
;
; Many thanks to the people who have contributed.  If you take issue with the
; contents, or would like to add something, please write to me
; (atari2600@taswegian.com) with your contribution.
;
; Latest Revisions...
;
; 1.05  14/NOV/2003      - Added VERSION_MACRO equate (which will reflect 100x version #)
;                          This will allow conditional code to verify MACRO.H being
;                          used for code assembly.
; 1.04  13/NOV/2003     - SET_POINTER macro added (16-bit address load)
;
; 1.03  23/JUN/2003     - CLEAN_START macro added - clears TIA, RAM, registers
;
; 1.02  14/JUN/2003     - VERTICAL_SYNC macro added
;                         (standardised macro for vertical synch code)
; 1.01  22/MAR/2003     - SLEEP macro added. 
;                       - NO_ILLEGAL_OPCODES switch implemented
; 1.0	22/MAR/2003		Initial release

; Note: These macros use illegal opcodes.  To disable illegal opcode usage, 
;   define the symbol NO_ILLEGAL_OPCODES (-DNO_ILLEGAL_OPCODES=1 on command-line).
;   If you do not allow illegal opcode usage, you must include this file 
;   *after* including VCS.H (as the non-illegal opcodes access hardware
;   registers and require them to be defined first).

; Available macros...
;   SLEEP n             - sleep for n cycles
;   VERTICAL_SYNC       - correct 3 scanline vertical synch code
;   CLEAN_START         - set machine to known state on startup
;   SET_POINTER         - load a 16-bit absolute to a 16-bit variable

;-------------------------------------------------------------------------------
; SLEEP duration
; Original author: Thomas Jentzsch
; Inserts code which takes the specified number of cycles to execute.  This is
; useful for code where precise timing is required.
; ILLEGAL-OPCODE VERSION DOES NOT AFFECT FLAGS OR REGISTERS.
; LEGAL OPCODE VERSION MAY AFFECT FLAGS
; Uses illegal opcode (DASM 2.20.01 onwards).

            MAC SLEEP            ;usage: SLEEP n (n>1)
.CYCLES     SET {1}

                IF .CYCLES < 2
                    ECHO "MACRO ERROR: 'SLEEP': Duration must be > 1"
                    ERR
                ENDIF

                IF .CYCLES & 1
                    IFNCONST NO_ILLEGAL_OPCODES
                        nop 0
                    ELSE
                        bit VSYNC
                    ENDIF
.CYCLES             SET .CYCLES - 3
                ENDIF
            
                REPEAT .CYCLES / 2
                    nop
                REPEND
            ENDM

;-------------------------------------------------------------------------------
; VERTICAL_SYNC
; Original author: Manuel Polik
; Inserts the code required for a proper 3 scannline 
; vertical sync sequence
;
; Note: Alters the accumulator
;
; IN:
; OUT: A = 1

            MAC VERTICAL_SYNC
                LDA #$02            ; A = VSYNC enable
                STA WSYNC           ; Finish current line
                STA VSYNC           ; Start vertical sync
                STA WSYNC           ; 1st line vertical sync
                STA WSYNC           ; 2nd line vertical sync
                LSR                 ; A = VSYNC disable
                STA WSYNC           ; 3rd line vertical sync
                STA VSYNC           ; Stop vertical sync
            ENDM

;-------------------------------------------------------------------------------
; CLEAN_START
; Original author: Andrew Davie
; Standardised start-up code, clears stack, all TIA registers and RAM to 0
; Sets stack pointer to $FF, and all registers to 0
; Sets decimal mode off, sets interrupt flag (kind of un-necessary)
; Use as very first section of code on boot (ie: at reset)
; Code written to minimise total ROM usage - uses weird 6502 knowledge :)

            MAC CLEAN_START
                sei
                cld
            
                ldx #0
                txa
                tay
.CLEAR_STACK    dex
                txs
                pha
                bne .CLEAR_STACK     ; SP=$FF, X = A = Y = 0

            ENDM

;-------------------------------------------------------
; SET_POINTER
; Original author: Manuel Rotschkar
;
; Sets a 2 byte RAM pointer to an absolute address.
;
; Usage: SET_POINTER pointer, address
; Example: SET_POINTER SpritePTR, SpriteData
;
; Note: Alters the accumulator, NZ flags
; IN 1: 2 byte RAM location reserved for pointer
; IN 2: absolute address

            MAC SET_POINTER
.POINTER    SET {1}
.ADDRESS    SET {2}

                LDA #<.ADDRESS  ; Get Lowbyte of Address
                STA .POINTER    ; Store in pointer
                LDA #>.ADDRESS  ; Get Hibyte of Address
                STA .POINTER+1  ; Store in pointer+1

            ENDM

; EOF
`;}


function fileVCS_H(){
   return `; VCS.H
; Version 1.05, 13/November/2003

VERSION_VCS         = 105

; THIS IS A PRELIMINARY RELEASE OF *THE* "STANDARD" VCS.H
; THIS FILE IS EXPLICITLY SUPPORTED AS A DASM-PREFERRED COMPANION FILE
; PLEASE DO *NOT* REDISTRIBUTE THIS FILE!
;
; This file defines hardware registers and memory mapping for the
; Atari 2600. It is distributed as a companion machine-specific support package
; for the DASM compiler. Updates to this file, DASM, and associated tools are
; available at at http://www.atari2600.org/dasm
;
; Many thanks to the original author(s) of this file, and to everyone who has
; contributed to understanding the Atari 2600.  If you take issue with the
; contents, or naming of registers, please write to me (atari2600@taswegian.com)
; with your views.  Please contribute, if you think you can improve this
; file!
;
; Latest Revisions...
; 1.05  13/NOV/2003      - Correction to 1.04 - now functions as requested by MR.
;                        - Added VERSION_VCS equate (which will reflect 100x version #)
;                          This will allow conditional code to verify VCS.H being
;                          used for code assembly.
; 1.04  12/NOV/2003     Added TIA_BASE_WRITE_ADDRESS and TIA_BASE_READ_ADDRESS for
;                       convenient disassembly/reassembly compatibility for hardware
;                       mirrored reading/writing differences.  This is more a
;                       readability issue, and binary compatibility with disassembled
;                       and reassembled sources.  Per Manuel Rotschkar's suggestion.
; 1.03  12/MAY/2003     Added SEG segment at end of file to fix old-code compatibility
;                       which was broken by the use of segments in this file, as
;                       reported by Manuel Polik on [stella] 11/MAY/2003
; 1.02  22/MAR/2003     Added TIMINT($285)
; 1.01	        		Constant offset added to allow use for 3F-style bankswitching
;						 - define TIA_BASE_ADDRESS as $40 for Tigervision carts, otherwise
;						   it is safe to leave it undefined, and the base address will
;						   be set to 0.  Thanks to Eckhard Stolberg for the suggestion.
;                          Note, may use -DLABEL=EXPRESSION to define TIA_BASE_ADDRESS
;                        - register definitions are now generated through assignment
;                          in uninitialised segments.  This allows a changeable base
;                          address architecture.
; 1.0	22/MAR/2003		Initial release


;-------------------------------------------------------------------------------

; TIA_BASE_ADDRESS
; The TIA_BASE_ADDRESS defines the base address of access to TIA registers.
; Normally 0, the base address should (externally, before including this file)
; be set to $40 when creating 3F-bankswitched (and other?) cartridges.
; The reason is that this bankswitching scheme treats any access to locations
; < $40 as a bankswitch.

			IFNCONST TIA_BASE_ADDRESS
TIA_BASE_ADDRESS	= 0
			ENDIF

; Note: The address may be defined on the command-line using the -D switch, eg:
; dasm.exe code.asm -DTIA_BASE_ADDRESS=$40 -f3 -v5 -ocode.bin
; *OR* by declaring the label before including this file, eg:
; TIA_BASE_ADDRESS = $40
;   include "vcs.h"

; Alternate read/write address capability - allows for some disassembly compatibility
; usage ; to allow reassembly to binary perfect copies).  This is essentially catering
; for the mirrored ROM hardware registers.

; Usage: As per above, define the TIA_BASE_READ_ADDRESS and/or TIA_BASE_WRITE_ADDRESS
; using the -D command-line switch, as required.  If the addresses are not defined,
; they defaut to the TIA_BASE_ADDRESS.

     IFNCONST TIA_BASE_READ_ADDRESS
TIA_BASE_READ_ADDRESS = TIA_BASE_ADDRESS
     ENDIF

     IFNCONST TIA_BASE_WRITE_ADDRESS
TIA_BASE_WRITE_ADDRESS = TIA_BASE_ADDRESS
     ENDIF

;-------------------------------------------------------------------------------

			SEG.U TIA_REGISTERS_WRITE
			ORG TIA_BASE_WRITE_ADDRESS

	; DO NOT CHANGE THE RELATIVE ORDERING OF REGISTERS!

VSYNC       ds 1    ; $00   0000 00x0   Vertical Sync Set-Clear
VBLANK		ds 1	; $01   xx00 00x0   Vertical Blank Set-Clear
WSYNC		ds 1	; $02   ---- ----   Wait for Horizontal Blank
RSYNC		ds 1	; $03   ---- ----   Reset Horizontal Sync Counter
NUSIZ0		ds 1	; $04   00xx 0xxx   Number-Size player/missle 0
NUSIZ1		ds 1	; $05   00xx 0xxx   Number-Size player/missle 1
COLUP0		ds 1	; $06   xxxx xxx0   Color-Luminance Player 0
COLUP1      ds 1    ; $07   xxxx xxx0   Color-Luminance Player 1
COLUPF      ds 1    ; $08   xxxx xxx0   Color-Luminance Playfield
COLUBK      ds 1    ; $09   xxxx xxx0   Color-Luminance Background
CTRLPF      ds 1    ; $0A   00xx 0xxx   Control Playfield, Ball, Collisions
REFP0       ds 1    ; $0B   0000 x000   Reflection Player 0
REFP1       ds 1    ; $0C   0000 x000   Reflection Player 1
PF0         ds 1    ; $0D   xxxx 0000   Playfield Register Byte 0
PF1         ds 1    ; $0E   xxxx xxxx   Playfield Register Byte 1
PF2         ds 1    ; $0F   xxxx xxxx   Playfield Register Byte 2
RESP0       ds 1    ; $10   ---- ----   Reset Player 0
RESP1       ds 1    ; $11   ---- ----   Reset Player 1
RESM0       ds 1    ; $12   ---- ----   Reset Missle 0
RESM1       ds 1    ; $13   ---- ----   Reset Missle 1
RESBL       ds 1    ; $14   ---- ----   Reset Ball
AUDC0       ds 1    ; $15   0000 xxxx   Audio Control 0
AUDC1       ds 1    ; $16   0000 xxxx   Audio Control 1
AUDF0       ds 1    ; $17   000x xxxx   Audio Frequency 0
AUDF1       ds 1    ; $18   000x xxxx   Audio Frequency 1
AUDV0       ds 1    ; $19   0000 xxxx   Audio Volume 0
AUDV1       ds 1    ; $1A   0000 xxxx   Audio Volume 1
GRP0        ds 1    ; $1B   xxxx xxxx   Graphics Register Player 0
GRP1        ds 1    ; $1C   xxxx xxxx   Graphics Register Player 1
ENAM0       ds 1    ; $1D   0000 00x0   Graphics Enable Missle 0
ENAM1       ds 1    ; $1E   0000 00x0   Graphics Enable Missle 1
ENABL       ds 1    ; $1F   0000 00x0   Graphics Enable Ball
HMP0        ds 1    ; $20   xxxx 0000   Horizontal Motion Player 0
HMP1        ds 1    ; $21   xxxx 0000   Horizontal Motion Player 1
HMM0        ds 1    ; $22   xxxx 0000   Horizontal Motion Missle 0
HMM1        ds 1    ; $23   xxxx 0000   Horizontal Motion Missle 1
HMBL        ds 1    ; $24   xxxx 0000   Horizontal Motion Ball
VDELP0      ds 1    ; $25   0000 000x   Vertical Delay Player 0
VDELP1      ds 1    ; $26   0000 000x   Vertical Delay Player 1
VDELBL      ds 1    ; $27   0000 000x   Vertical Delay Ball
RESMP0      ds 1    ; $28   0000 00x0   Reset Missle 0 to Player 0
RESMP1      ds 1    ; $29   0000 00x0   Reset Missle 1 to Player 1
HMOVE       ds 1    ; $2A   ---- ----   Apply Horizontal Motion
HMCLR       ds 1    ; $2B   ---- ----   Clear Horizontal Move Registers
CXCLR       ds 1    ; $2C   ---- ----   Clear Collision Latches

;-------------------------------------------------------------------------------

			SEG.U TIA_REGISTERS_READ
			ORG TIA_BASE_READ_ADDRESS

                    ;											bit 7   bit 6
CXM0P       ds 1    ; $00       xx00 0000       Read Collision  M0-P1   M0-P0
CXM1P       ds 1    ; $01       xx00 0000                       M1-P0   M1-P1
CXP0FB      ds 1    ; $02       xx00 0000                       P0-PF   P0-BL
CXP1FB      ds 1    ; $03       xx00 0000                       P1-PF   P1-BL
CXM0FB      ds 1    ; $04       xx00 0000                       M0-PF   M0-BL
CXM1FB      ds 1    ; $05       xx00 0000                       M1-PF   M1-BL
CXBLPF      ds 1    ; $06       x000 0000                       BL-PF   -----
CXPPMM      ds 1    ; $07       xx00 0000                       P0-P1   M0-M1
INPT0       ds 1    ; $08       x000 0000       Read Pot Port 0
INPT1       ds 1    ; $09       x000 0000       Read Pot Port 1
INPT2       ds 1    ; $0A       x000 0000       Read Pot Port 2
INPT3       ds 1    ; $0B       x000 0000       Read Pot Port 3
INPT4       ds 1    ; $0C		x000 0000       Read Input (Trigger) 0
INPT5       ds 1	; $0D		x000 0000       Read Input (Trigger) 1

;-------------------------------------------------------------------------------

			SEG.U RIOT
			ORG $280

	; RIOT MEMORY MAP

SWCHA       ds 1    ; $280      Port A data register for joysticks:
					;			Bits 4-7 for player 1.  Bits 0-3 for player 2.

SWACNT      ds 1    ; $281      Port A data direction register (DDR)
SWCHB       ds 1    ; $282		Port B data (console switches)
SWBCNT      ds 1    ; $283      Port B DDR
INTIM       ds 1    ; $284		Timer output

TIMINT  	ds 1	; $285

		; Unused/undefined registers ($285-$294)

			ds 1	; $286
			ds 1	; $287
			ds 1	; $288
			ds 1	; $289
			ds 1	; $28A
			ds 1	; $28B
			ds 1	; $28C
			ds 1	; $28D
			ds 1	; $28E
			ds 1	; $28F
			ds 1	; $290
			ds 1	; $291
			ds 1	; $292
			ds 1	; $293

TIM1T       ds 1    ; $294		set 1 clock interval
TIM8T       ds 1    ; $295      set 8 clock interval
TIM64T      ds 1    ; $296      set 64 clock interval
T1024T      ds 1    ; $297      set 1024 clock interval

;-------------------------------------------------------------------------------
; The following required for back-compatibility with code which does not use
; segments.

            SEG

; EOF
`;
}