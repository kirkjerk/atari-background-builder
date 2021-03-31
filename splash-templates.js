
function get48pxBasic(){
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

function getByteBuff(line, place){
   let buf = '	BYTE %';
   for(let x = place * 8; x < (place + 1) * 8; x++) {
      buf += line[x] ? '1' : '0';
   }
   buf += '\n';
   return buf;   
}

function make48pxblocks(){
	//we have 6 blocks, one for each section...	
	const block = ['','','','','',''];

	for(let y = H - 1; y >= 0; y--){
	   
	   for(let p = 0; p < 6; p++){
		  block[p] += getByteBuff(yxGrid[y], p);
	   }
	}
	return block;
}


function get48pxMonoASM(){
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




function get48pxColorASM(){
	const block = make48pxblocks();
   
   let colorblock = '';

   for(let y = H-1; y >= 0; y--){
      colorblock += `   .byte $${colorGrid[y]}\n`
   }



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
function getBBPFColors() {
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


function getBBPFDPCColors(){
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

