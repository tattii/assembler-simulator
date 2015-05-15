app.filter('number', function() {
    return function(input, isHex) {
		function zpad(input, n) {
			if(input === undefined){
				input = "";
			}
			if(input.length >= n){
				return input;
			}
			var zeros = "0".repeat(n);
			return (zeros + input).slice(-1 * n);
		}

        if (isHex) {
            var hex = input.toString(16).toUpperCase();
            return zpad(hex, 4);
        } else {
            return input.toString(10);
        }
    };
});
