var w3cValidator = require('w3cjs');

var MarkupValidator = function(log){
	this.validate = function(options, hasPassedCallback){
		var pageValidationMonitor = new PageValidationMonitor(options.pages, options.failOnError, hasPassedCallback);
		options.pages.forEach(function(pageUriOrFile){
			var webpage = new Webpage(pageUriOrFile, log);
			webpage.validate(pageValidationMonitor.notify);
		});
	};
};

var PageValidationMonitor = function(pages, failOnError, hasPassedCallback){
	var pageCount = pages.length,
		passedAllPages = true;

	this.notify = function(passed){
		pageCount--;
		if(!passed && failOnError){
			passedAllPages = false;
		}
		if(pageCount === 0){
			hasPassedCallback(passedAllPages);
		}
	};
};

var Webpage = function(pageUriOrFile, log){
	var w3cErrorDisplay = new W3cErrorDisplay(log, pageUriOrFile);

	this.validate = function(passed){
		w3cValidator.validate({
			file : pageUriOrFile,
			callback : function(results){
				var hasPassed = results.messages.length === 0;
				if (!hasPassed){
					results.messages.forEach(w3cErrorDisplay.show);
				}
				passed(hasPassed);
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