var w3cValidator = require('w3cjs');

var MarkupValidator = function(){
	this.validate = function(options){
		options.files.forEach(function(file){
			w3cValidator.validate({
				file : file,
				callback : function(){

				}
			});
		});
	};
};

module.exports = MarkupValidator;