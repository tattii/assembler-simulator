app.controller('Ctrl', ['$document', '$scope', '$timeout', 'cpu', 'memory', 'assembler', function ($document, $scope, $timeout, cpu, memory, assembler) {
    $scope.memory = memory;
    $scope.cpu = cpu;
    $scope.error = '';
    $scope.isRunning = false;
    $scope.displayHex = true;
    $scope.displayInstr = true;
    $scope.displayA = false;
    $scope.displayB = true;
    $scope.displayC = true;
    $scope.displayD = true;
    $scope.speeds = [{speed: 1, desc: "1 HZ"},
                     {speed: 4, desc: "4 HZ"},
                     {speed: 8, desc: "8 HZ"},
                     {speed: 16, desc: "16 HZ"}];
    $scope.speed = 4;
	$scope.dataStartIndex = 128;

	$scope.code = "LI R1, 128\n" +
		"LI R3, 128\n" +
		"ADDI R3, 7\n" +
		"MOV R2, R1\n" +
		"LD R4, 0(R2)\n" +
		"LD R5, 1(R2)\n" +
		"CMP R4, R5\n" +
		"BLE 2\n" +
		"ST R4, 1(R2)\n" +
		"ST R5, 0(R2)\n" +
		"ADDI R2, 1\n" +
		"CMP R2, R3\n" +
		"BLT -9\n" +
		"ADDI R1, 1\n" +
		"CMP R1, R3\n" +
		"BLT -13\n" +
		"HLT";

    $scope.reset = function () {
        cpu.reset();
        memory.reset();
        $scope.error = '';
        $scope.selectedLine = -1;
    };

    $scope.executeStep = function () {
        if (!$scope.checkPrgrmLoaded()) {
            $scope.assemble();
        }

        try {
            // Execute
            $scope.selectedLine = cpu.pc;
            var res = cpu.step();
            return res;
        } catch (e) {
            $scope.error = e;
            return false;
        }
    };

    var runner;
    $scope.run = function () {
        if (!$scope.checkPrgrmLoaded()) {
            $scope.assemble();
        }

        $scope.isRunning = true;
        runner = $timeout(function () {
            if ($scope.executeStep() === true) {
                $scope.run();
            } else {
                $scope.isRunning = false;
            }
        }, 1000 / $scope.speed);
    };

    $scope.stop = function () {
        $timeout.cancel(runner);
        $scope.isRunning = false;
    };

    $scope.checkPrgrmLoaded = function () {
        for (var i = 0, l = memory.data.length/2; i < l; i++) {
            if (memory.data[i] !== 0) {
                return true;
            }
        }

        return false;
    };

    $scope.getChar = function (value) {
        var text = String.fromCharCode(value);

        if (text.trim() === '') {
            return '\u00A0\u00A0';
        } else {
            return text;
        }
    };

    $scope.assemble = function () {
        try {
            $scope.reset();

            var assembly = assembler.go($scope.code);
			memory.instrs = assembly;

            if (assembly.length > memory.data.length)
                throw "Binary code does not fit into the memory. Max " + memory.data.length + " bytes are allowed";

            for (var i = 0, l = assembly.length; i < l; i++) {
                memory.data[i] = assembly[i].code;
            }
        } catch (e) {
            if (e.line !== undefined) {
                $scope.error = e.line + " | " + e.error;
                $scope.selectedLine = e.line;
            } else {
                $scope.error = e.error;
            }
        }
    };

    $scope.jumpToLine = function (index) {
        $document[0].getElementById('sourceCode').scrollIntoView();
        $scope.selectedLine = $scope.mapping[index];
    };


    $scope.isInstruction = function (index) {
        return $scope.mapping !== undefined &&
            $scope.mapping[index] !== undefined &&
            $scope.displayInstr;
    };

    $scope.getMemoryCellCss = function (index) {
		if (index >= $scope.dataStartIndex) {
			return 'output-bg';
		} else if ($scope.isInstruction(index)) {
            return 'instr-bg';
        } else {
            return '';
        }
    };

    $scope.getMemoryInnerCellCss = function (index) {
        if (index === cpu.pc) {
            return 'marker marker-ip';
        } else if (index === cpu.gpr[0] && $scope.displayA) {
            return 'marker marker-a';
        } else if (index === cpu.gpr[1] && $scope.displayB) {
            return 'marker marker-b';
        } else if (index === cpu.gpr[2] && $scope.displayC) {
            return 'marker marker-c';
        } else if (index === cpu.gpr[3] && $scope.displayD) {
            return 'marker marker-d';
        } else {
            return '';
        }
    };
}]);
