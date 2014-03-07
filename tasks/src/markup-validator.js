var w3cValidator = require('w3cjs');

var MarkupValidator = function(log){
	this.validate = function(options){
		options.files.forEach(function(file){
			w3cValidator.validate({
				file : file,
				callback : function(results){
					if (!!results){
						var error = results.messages[0],
							errorMessage = file + ' | line ' + error.lastLine + ' | ' + error.message;
						log.error(errorMessage);
					}
				}
			});
		});
	};
};

module.exports = MarkupValidator;