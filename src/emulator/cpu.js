app.service('cpu', ['memory', function(memory) {
    var cpu = {
        step: function() {
            var self = this;


            try {
                var jump = function(newPC) {
                    if (newPC < 0 || newPC >= memory.data.length) {
                        throw "PC outside memory";
                    } else {
                        self.pc = newPC;
                    }
                };

                if (self.pc < 0 || self.pc >= memory.data.length) {
                    throw "Program Counter is outside of memory";
                }
                
                var instr = memory.loadInstr(self.pc);
				self.count++;
				var zero = 0, sign = 0, v = 0;
				console.log(instr);
                switch(instr.op) {
					case 'HLT':
						return false;

					// ALU
					case 'ADD':
						self.gpr[instr.rd] = self.gpr[instr.rd] + self.gpr[instr.rs];
						self.pc++;
						break;
					case 'SUB':
						self.gpr[instr.rd] = self.gpr[instr.rd] - self.gpr[instr.rs];
						self.pc++;
						break;
					case 'AND':
						self.gpr[instr.rd] = self.gpr[instr.rd] & self.gpr[instr.rs];
						self.pc++;
						break;
					case 'OR':
						self.gpr[instr.rd] = self.gpr[instr.rd] | self.gpr[instr.rs];
						self.pc++;
						break;
					case 'XOR':
						self.gpr[instr.rd] = self.gpr[instr.rd] ^ self.gpr[instr.rs];
						self.pc++;
						break;
					case 'CMP':
						var res = self.gpr[instr.rd] - self.gpr[instr.rs];
						if (res === 0) zero = 1;
						if (res < 0)  sign = 1;
						if (res > 32768 || res < -32769) v = 1;
						self.pc++;
						break;
					case 'MOV':
						self.gpr[instr.rd] = self.gpr[instr.rs];
						self.pc++;
						break;

					// I/O IN*
					case 'OUT':
						self.output = self.gpr[instr.rs];
						self.pc++;
						break;

					// shift
					case 'SLL':
						self.gpr[instr.rd] = self.gpr[instr.rd] << instr.d;
						self.pc++;
						break;
					case 'SLR':
						self.gpr[instr.rd] = (self.gpr[instr.rd] << instr.d) + (self.gpr[instr.rd] >>> (16-instr.d));
						self.pc++;
						break;
					case 'SRL':
						self.gpr[instr.rd] = self.gpr[instr.rd] >>> instr.d;
						self.pc++;
						break;
					case 'SRA':
						self.gpr[instr.rd] = self.gpr[instr.rd] >> instr.d;
						self.pc++;
						break;

					// load/store
					case 'LD':
						self.gpr[instr.ra] = memory.load(self.gpr[instr.rb] + instr.d);
						self.pc++;
						break;
					case 'ST':
						memory.store(self.gpr[instr.rb] + instr.d, self.gpr[instr.ra]);
						self.pc++;
						break;

					case 'LI':
						self.gpr[instr.rb] = instr.d;
						self.pc++;
						break;
					case 'ADDI':
						self.gpr[instr.rb] = self.gpr[instr.rb] + instr.d;
						self.pc++;
						break;

					// branch
					case 'B':
						jump(self.pc + 1 + instr.d);
						break;

					case 'BE':
						if (self.zero) {
							jump(self.pc + 1 + instr.d);
						}else{
							self.pc++;
						}
						break;
					case 'BLT':
						if (self.sign ^ self.v) {
							jump(self.pc + 1 + instr.d);
						}else{
							self.pc++;
						}
						break;
					case 'BLE':
						if (self.zero | (self.sign ^ self.v)) {
							jump(self.pc + 1 + instr.d);
						}else{
							self.pc++;
						}
						break;
					case 'BNE':
						if (!self.zero) {
							jump(self.pc + 1 + instr.d);
						}else{
							self.pc++;
						}
						break;

					default:
                        throw "Invalid op code: " + instr.op;
                }

				self.zero = zero;
				self.sign = sign;
				self.v = v;
                return true;
            } catch(e) {
                self.fault = true;
                throw e;
            }
        },
        reset: function() {
            var self = this;

            self.gpr = [0, 0, 0, 0, 0, 0, 0, 0]; // 8 reg
			self.pc = 0;
			self.sign = 0;
            self.zero = 0;
            self.v    = 0;
			self.output = 0;
			self.count = 0;
        }
    };

    cpu.reset();
    return cpu;
}]);
