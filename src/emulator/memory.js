app.service('memory', [function () {
    var memory = {
        data: Array(256),
        lastAccess: -1,
        load: function (address) {
            var self = this;

            if (address < 0 || address >= self.data.length) {
                throw "Memory access violation at " + address;
            }

            self.lastAccess = address;
            return self.data[address];
        },
        loadInstr: function (address) {
            var self = this;

            if (address < 0 || address >= self.data.length) {
                throw "Memory access violation at " + address;
            }

            self.lastAccess = address;
            return self.instrs[address];
        },
        store: function (address, value) {
            var self = this;

            if (address < 0 || address >= self.data.length) {
                throw "Memory access violation at " + address;
            }

            self.lastAccess = address;
            self.data[address] = value;
        },
        reset: function () {
            var self = this;

            self.lastAccess = -1;
            if(self.instrs) self.instrs = null;
            for (var i = 0, l = self.data.length/2; i < l; i++) {
                self.data[i] = 0;
            }
            for (var j = self.data.length/2, k = self.data.length; j < k; j++) {
                self.data[j] = Math.floor( Math.random() * 1024 );

            }
        }
    };

    memory.reset();
    return memory;
}]);
