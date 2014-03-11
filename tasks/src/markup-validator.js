var w3cValidator = require('w3cjs');

var MarkupValidator = function(log){
	this.validate = function(options, hasPassedCallback){
		var numberOfPages = options.files.length,
			completedPages = 0,
			passedAllPages = true,
			pageValidationMonitor = new PageValidationMonitor(options.files, hasPassedCallback);
		
		options.files.forEach(function(pageUriOrFile){
			var webpage = new Webpage(pageUriOrFile, log);
			webpage.validate(pageValidationMonitor.notify);
		});
	};
};

var PageValidationMonitor = function(pages, hasPassedCallback){
	var pageCount = pages.length,
		passedAllPages = true;

	this.notify = function(passed){
		pageCount--;
		if(!passed){
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
				if (!!results){
					results.messages.forEach(w3cErrorDisplay.show);
					passed(false);
				}
				else {
					passed(true);
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