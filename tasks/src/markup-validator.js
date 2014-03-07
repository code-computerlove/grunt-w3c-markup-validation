var w3cValidator = require('w3cjs');

var MarkupValidator = function(){
	this.validate = function(options){
		w3cValidator.validate({
			file : options.files[0]
		});
	};
};

module.exports = MarkupValidator;