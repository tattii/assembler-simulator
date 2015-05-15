app.service('cpu', ['memory', function(memory) {
    var cpu = {
        step: function() {
            var self = this;

            if (self.fault === true) {
                throw "FAULT. Reset to continue.";
            }

            try {

                var jump = function(newPC) {
                    if (newPC < 0 || newPC >= memory.data.length) {
                        throw "PC outside memory";
                    } else {
                        self.pc = newPC;
                    }
                };

                var division = function(divisor) {
                    if (divisor === 0) {
                        throw "Division by 0";
                    }

                    return Math.floor(self.gpr[0] / divisor);
                };

                if (self.pc < 0 || self.pc >= memory.data.length) {
                    throw "Program Counter is outside of memory";
                }
                
                var instr = memory.loadInstr(self.pc);
				console.log(instr);
                switch(instr.op) {
					case 'HLT':
						return false;
					case 'LI':
						self.gpr[instr.rb] = instr.d;
						self.pc++;
						break;

					case 'MOV':
						self.gpr[instr.rd] = self.gpr[instr.rs];
						self.pc++;
						break;
					
					default:
                        throw "Invalid op code: " + instr;
                }

                return true;
            } catch(e) {
                self.fault = true;
                throw e;
            }
        },
        reset: function() {
            var self = this;

            self.gpr = [0, 0, 0, 0, 0, 0, 0, 0];
			self.pc = 0;
            self.zero = false;
            self.carry = false;
            self.fault = false;
            self.v = false;
			self.output = 0;
        }
    };

    cpu.reset();
    return cpu;
}]);
