var w3cValidator = require('w3cjs');

var MarkupValidator = function(log){
	this.validate = function(options, hasPassedCallback){
		var numberOfFiles = options.files.length,
			completed = 0,
			passedAllPages = true;
		options.files.forEach(function(pageUriOrFile){
			new Webpage(pageUriOrFile, log).validate(function(pagePassed){
				completed++;
				if (!pagePassed){
					passedAllPages = false;
				}
				if (completed === numberOfFiles){
					hasPassedCallback(passedAllPages);
				}
			});
		});
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