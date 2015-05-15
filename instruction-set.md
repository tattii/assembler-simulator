SIMPLE Instruction Set
======

|           |    |
|:----------|:---|
|ADD Rd, Rs |r[Rd] = r[Rd] + r[Rs]|
|SUB Rd, Rs |r[Rd] = r[Rd] - r[Rs]|
|AND Rd, Rs |r[Rd] = r[Rd] & r[Rs]|
|OR  Rd, Rs |r[Rd] = r[Rd] | r[Rs]|
|XOR Rd, Rs |r[Rd] = r[Rd] ^ r[Rs]|
|CMP Rd, Rs |r[Rd] - r[Rs]|
|MOV Rd, Rs |r[Rd] = r[Rs]|
|SLL Rd, d  |r[Rd] = shift_left_logical(r[Rd],d)|
|SLR Rd, d  |r[Rd] = shift_left_rotate(r[Rd],d)|
|SRL Rd, d  |r[Rd] = shift_left_logical(r[Rd],d)|
|SRA Rd, d  |r[Rd] = shift_left_arithmetic(r[Rd],d)|
|IN  Rd     |r[Rd] = input|
|OUT Rs     |output = r[Rs]|
|HLT        |halt()|
|LD Ra,d(Rb)|r[Ra] = *(r[Rb] + sign_ext(d))|
|ST Ra,d(Rb)|*(r[Rb] + sign_ext(d)) = r[Ra]|
|LI   Rb, d |r[Rb] = sign_ext(d)|
|ADDI Rb, d |r[Rb] = r[Rb] + sign_ext(d)|
|B    Rb, d |PC = PC + 1 + sign_ext(d)|
|BE  d      |if(Z)        PC = PC + 1 + sign_ext(d)|
|BLT d      |if(S^V)      PC = PC + 1 + sign_ext(d)|
|BLE d      |if(Z\|\|(S^V)) PC = PC + 1 + sign_ext(d)|
|BNE d      |if(!Z)       PC = PC + 1 + sign_ext(d)|
