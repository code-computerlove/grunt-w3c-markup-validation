/*jshint expr: true*/

var rewire = require('rewire'),
	W3cMarkupValidationPlugin = rewire('../tasks/src/markup-validator'),
	FakeLog = function(){
		this.errors = [];
		this.oks = [];
		this.error = function(error){
			this.errors.push(error);
		};
		this.ok = function(ok){
			this.oks.push(ok);
		};
	},
	fakeCallbackMethod = function(){};

require('chai').should();

test('When one page is validated Then w3c validation performed on page by name', function(done){
	var fileName = 'random file ' + Math.random(),
		onePage = [fileName],
		mockW3c = {
			validate : function(options){
				options.file.should.equal(fileName);
				done();
			}
		};
	W3cMarkupValidationPlugin.__set__("w3cValidator", mockW3c);

	new W3cMarkupValidationPlugin(new FakeLog()).validate({
		pages: onePage
	}, fakeCallbackMethod);
});

test('When multiple pages are validated Then w3c validation performed on each page by name', function(){
	var firstPageName = 'random file ' + Math.random(),
		secondPageName = 'another random ' + Math.random(),
		multiplePages = [firstPageName, secondPageName],
		validatedPages = [],
		mockW3c = {
			validate : function(options){
				validatedPages.push(options.file);
				options.callback({messages : []});
			}
		};
	W3cMarkupValidationPlugin.__set__("w3cValidator", mockW3c);

	new W3cMarkupValidationPlugin(new FakeLog()).validate({
		pages: multiplePages
	}, fakeCallbackMethod);
	validatedPages.should.eql(multiplePages);
});

test('When invalid page is validated And one error Then error details are added to log', function(){
	var invalidPageName = 'random file ' + Math.random(),
		line = Math.random(),
		message = 'an error ' + Math.random(),
		mockW3c = {
			validate : function(options){
				options.callback({
					messages : [{
						lastLine : line,
						message : message
					}]
				});
			}
		},
		fakeLog = new FakeLog();
	W3cMarkupValidationPlugin.__set__("w3cValidator", mockW3c);

	new W3cMarkupValidationPlugin(fakeLog).validate({
		pages: [invalidPageName]
	}, fakeCallbackMethod);
	fakeLog.errors[0].should.equal(invalidPageName + ' | line ' + line + ' | ' + message);
});

test('When invalid page is validated And multiple errors Then error details are added to log', function(){
	var invalidPageName = 'random file ' + Math.random(),
		line = Math.random(),
		message = 'an error ' + Math.random(),
		error1 = {},
		mockW3c = {
			validate : function(options){
				options.callback({
					messages : [
						error1,
						{
							lastLine : line,
							message : message
						}
					]
				});
			}
		},
		fakeLog = new FakeLog();
	W3cMarkupValidationPlugin.__set__("w3cValidator", mockW3c);

	new W3cMarkupValidationPlugin(fakeLog).validate({
		pages: [invalidPageName]
	}, fakeCallbackMethod);
	fakeLog.errors[1].should.equal(invalidPageName + ' | line ' + line + ' | ' + message);
});

test('When invalid page is validated And user wants task to fail on error Then task does not pass', function(done){
	var mockW3c = {
			validate : function(options){
				options.callback({
					messages : [{}]
				});
			}
		};
	W3cMarkupValidationPlugin.__set__("w3cValidator", mockW3c);

	new W3cMarkupValidationPlugin(new FakeLog()).validate({
		pages: ['aPage'],
		failOnError : true
	}, function(passed){
		passed.should.be.false;
		done();
	});
});

test('When valid page is validated Then task does pass', function(done){
	var mockW3c = {
			validate : function(options){
				options.callback({messages : []});
			}
		};
	W3cMarkupValidationPlugin.__set__("w3cValidator", mockW3c);

	new W3cMarkupValidationPlugin(new FakeLog()).validate({
		pages: ['aPage'],
		failOnError : true
	}, function(passed){
		passed.should.be.true;
		done();
	});
});

test('When valid and invalid file is validated And user wants task to fail on error Then task does not pass', function(done){
	var validPage = 'aValidPage',
		invalidPage = 'anInvalidPage',
		validPageResult = {messages : []},
		invalidPageResult = {messages : [{}]},
		pageValidationResults = {};

	pageValidationResults[validPage] = validPageResult;
	pageValidationResults[invalidPage] = invalidPageResult;

	var	mockW3c = {
			validate : function(options){
				options.callback(pageValidationResults[options.file]);
			}
		};
	W3cMarkupValidationPlugin.__set__("w3cValidator", mockW3c);

	new W3cMarkupValidationPlugin(new FakeLog()).validate({
		pages: [invalidPage, validPage],
		failOnError : true
	}, function(passed){
		passed.should.be.false;
		done();
	});
});

test('When invalid page is validated And user wants does not want task to fail on error Then task does pass', function(done){
	var mockW3c = {
			validate : function(options){
				options.callback({
					messages : [{}]
				});
			}
		};
	W3cMarkupValidationPlugin.__set__("w3cValidator", mockW3c);

	new W3cMarkupValidationPlugin(new FakeLog()).validate({
		pages: ['aPage'],
		failOnError : false
	}, function(passed){
		passed.should.be.true;
		done();
	});
});

test('When invalid page is validated And user wants does specify whether they want to fail on error Then task does not pass (default option)', function(done){
	var mockW3c = {
			validate : function(options){
				options.callback({
					messages : [{}]
				});
			}
		};
	W3cMarkupValidationPlugin.__set__("w3cValidator", mockW3c);

	new W3cMarkupValidationPlugin(new FakeLog()).validate({
		pages: ['aPage']
	}, function(passed){
		passed.should.be.true;
		done();
	});
});


