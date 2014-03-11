var w3cValidator = require('w3cjs');

var MarkupValidator = function(log){
	this.validate = function(options, hasPassedCallback){
		options.files.forEach(function(pageUriOrFile){
			new WebPageMarkupValidator(pageUriOrFile, log, hasPassedCallback).validate();
		});
	};

	function validatePage(pageUriOrFile){
		new WebPageMarkupValidator(pageUriOrFile, log).validate();
	}
};

var WebPageMarkupValidator = function(pageUriOrFile, log, passed){
	var w3cErrorDisplay = new W3cErrorDisplay(log, pageUriOrFile);

	this.validate = function(){
		w3cValidator.validate({
			file : pageUriOrFile,
			callback : function(results){
				if (!!results){
					results.messages.forEach(w3cErrorDisplay.show);
					passed(false);
				}
			}
		});
	};
};

var W3cErrorDisplay = function(log, file){
	this.show = function(error){
		var errorMessage = file + ' | line ' + error.lastLine + ' | ' + error.message;
		log.error(errorMessage);
	};
};

module.exports = MarkupValidator;