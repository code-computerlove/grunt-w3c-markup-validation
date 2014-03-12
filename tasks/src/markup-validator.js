var w3cValidator = require('w3cjs'),
	_ = require('underscore');

var MarkupValidator = function(log){
	this.validate = function(options, hasPassedCallback){
		var pageW3cValidator = new PageW3cValidator(options.ignore),
			pageValidationMonitor = new PageValidationMonitor(options.pages, options.failOnError, hasPassedCallback);
		
		options.pages.forEach(function(pageUriOrFile){
			var webpage = new Webpage(pageUriOrFile, log, pageW3cValidator);
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

var Webpage = function(pageUriOrFile, log, pageW3cValidator){
	var w3cErrorDisplay = new W3cErrorDisplay(log, pageUriOrFile);

	this.validate = function(passed){
		pageW3cValidator.validate(pageUriOrFile, function(errors){
			var hasPassed = errors.length === 0;
			if (!hasPassed){
				errors.forEach(w3cErrorDisplay.show);
			}
			passed(hasPassed);
		});
	};
};

var PageW3cValidator = function(ignore){
	var ignoreErrors = !!ignore ? new RegExp(ignore.join('|')) : new RegExp('');

	this.validate = function(pageUriOrFile, callback){
		w3cValidator.validate({
			file : pageUriOrFile,
			callback : function(results){
				if (!!ignore){
					var groomedMessages = _.filter(results.messages, function(errorMessage){
						return !ignoreErrors.test(errorMessage.message);
					});
					callback(groomedMessages);
				}
				else {
					callback(results.messages);
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