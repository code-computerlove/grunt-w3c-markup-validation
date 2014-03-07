var w3cValidator = require('w3cjs');

module.exports = function(){
	this.validate = function(options){
		w3cValidator.validate({
			file : options.files[0]
		});
	};
};