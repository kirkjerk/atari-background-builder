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
playfield_lines=44w
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
    .byte %10000000
    .byte %01000000
    .byte %01000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %11000000
    .byte %01000000
    .byte %00100000
    .byte %00100000
    .byte %00100000
    .byte %00100000
    .byte %01100000
    .byte %11000000
    .byte %10000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %11000000
    .byte %01100000
    .byte %00110000

   if >. != >[.+(playfield_lines)]
      align 256
   endif

PF1DataA
    .byte %11100000
    .byte %11010000
    .byte %00001000
    .byte %00001001
    .byte %00001101
    .byte %00000101
    .byte %00000101
    .byte %00000101
    .byte %00011001
    .byte %00110000
    .byte %11000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %11000000
    .byte %01110000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %10000000
    .byte %10000010
    .byte %10000010
    .byte %11000010
    .byte %01000010
    .byte %01000010
    .byte %01000010
    .byte %01000010
    .byte %01000010
    .byte %01000000
    .byte %01000000
    .byte %01000010
    .byte %01000010
    .byte %01000000
    .byte %11111000
    .byte %00001100
    .byte %00000110

   if >. != >[.+(playfield_lines)]
      align 256
   endif

PF2DataA
    .byte %00000000
    .byte %00010110
    .byte %00010011
    .byte %00010001
    .byte %00010000
    .byte %00010000
    .byte %10010000
    .byte %10110000
    .byte %10110111
    .byte %11100011
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00001000
    .byte %00011000
    .byte %00010000
    .byte %00010000
    .byte %00010000
    .byte %00010000
    .byte %00010000
    .byte %00010000
    .byte %00010000
    .byte %01111000
    .byte %00010100
    .byte %00010000
    .byte %00010000
    .byte %00010000
    .byte %00000000

   if >. != >[.+(playfield_lines)]
      align 256
   endif

PF0DataB
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %10000000
    .byte %01000000
    .byte %01000000
    .byte %00100000
    .byte %01100000
    .byte %11000000
    .byte %01000000
    .byte %01000000
    .byte %01000000
    .byte %11000000
    .byte %10000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %01000000
    .byte %01000000
    .byte %01000000
    .byte %11000000
    .byte %10000000
    .byte %10000000
    .byte %10000000
    .byte %10000000
    .byte %10000000
    .byte %10000000
    .byte %10000000
    .byte %10000000
    .byte %10000000
    .byte %10000000
    .byte %00000000
    .byte %00000000

   if >. != >[.+(playfield_lines)]
      align 256
   endif

PF1DataB
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %11100001
    .byte %00000011
    .byte %00000010
    .byte %00000100
    .byte %00000100
    .byte %10000100
    .byte %01000111
    .byte %00100100
    .byte %00100100
    .byte %00100010
    .byte %11100011
    .byte %00000001
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000111
    .byte %00001100
    .byte %00011000
    .byte %00010000
    .byte %00011100
    .byte %00010011
    .byte %00011001
    .byte %00001000
    .byte %00001100
    .byte %00000111
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000
    .byte %00000000

   if >. != >[.+(playfield_lines)]
      align 256
   endif

PF2DataB
    .byte %00000000    
    .byte %00000000    
    .byte %00000000    
    .byte %01001011    
    .byte %01001010    
    .byte %01001000    
    .byte %01001000    
    .byte %01001000
    .byte %01001000    
    .byte %01001000    
    .byte %01001001    
    .byte %01101011    
    .byte %00111010    
    .byte %00001010    
    .byte %00001011    
    .byte %00000000
    .byte %00000000    
    .byte %00000000    
    .byte %00000000    
    .byte %00000000    
    .byte %00000000    
    .byte %00000000    
    .byte %00000000    
    .byte %00000000
    .byte %00000000    
    .byte %00000000    
    .byte %00000000    
    .byte %00000000    
    .byte %00000000    
    .byte %00000011    
    .byte %00000000    
    .byte %00000000
    .byte %00000000    
    .byte %00000000    
    .byte %00000000    
    .byte %00000001    
    .byte %00000011    
    .byte %00000010    
    .byte %00000001    
    .byte %00000000
    .byte %00000000    
    .byte %00000000    
    .byte %00000000    
    .byte %00000000

   if >. != >[.+(playfield_lines)]
      align 256
   endif

PFColors
    .byte $66
    .byte $64
    .byte $66
    .byte $68
    .byte $66
    .byte $68
    .byte $6A
    .byte $68
    .byte $6A
    .byte $6C
    .byte $6A
    .byte $86
    .byte $84
    .byte $86
    .byte $88
    .byte $86
    .byte $88
    .byte $8A
    .byte $88
    .byte $8A
    .byte $8C
    .byte $8A
    .byte $C6
    .byte $C4
    .byte $C6
    .byte $C8
    .byte $C6
    .byte $C8
    .byte $CA
    .byte $C8
    .byte $CA
    .byte $CC
    .byte $CA
    .byte $46
    .byte $44
    .byte $46
    .byte $48
    .byte $46
    .byte $48
    .byte $4A
    .byte $48
    .byte $4A
    .byte $4C
    .byte $4A


    ECHO ([$FFFC-.]d), "bytes free"

    org $fffc
    .word Start
    .word Start

