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
	};

require('chai').should();

test('When one file is validated Then w3c validation performed on file by name', function(done){
	var fileName = 'random file ' + Math.random(),
		oneFile = [fileName],
		mockW3c = {
			validate : function(options){
				options.file.should.equal(fileName);
				done();
			}
		};
	W3cMarkupValidationPlugin.__set__("w3cValidator", mockW3c);

	new W3cMarkupValidationPlugin(new FakeLog()).validate({
		files: oneFile
	});
});

test('When multiple files are validated Then w3c validation performed on each file by name', function(){
	var firstFileName = 'random file ' + Math.random(),
		secondFileName = 'another random ' + Math.random(),
		multipleFiles = [firstFileName, secondFileName],
		validatedFiles = [],
		mockW3c = {
			validate : function(options){
				validatedFiles.push(options.file);
				options.callback();
			}
		};
	W3cMarkupValidationPlugin.__set__("w3cValidator", mockW3c);

	new W3cMarkupValidationPlugin(new FakeLog()).validate({
		files: multipleFiles
	});
	validatedFiles.should.eql(multipleFiles);
});

test('When invalid file is validated And one error Then error details are added to log', function(){
	var fileName = 'random file ' + Math.random(),
		line = Math.random(),
		message = 'an error ' + Math.random(),
		oneFile = [fileName],
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
		files: oneFile
	}, function(){});
	fakeLog.errors[0].should.equal(fileName + ' | line ' + line + ' | ' + message);
});

test('When invalid file is validated And multiple errors Then error details are added to log', function(){
	var fileName = 'random file ' + Math.random(),
		line = Math.random(),
		message = 'an error ' + Math.random(),
		oneFile = [fileName],
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
		files: oneFile
	}, function(){});
	fakeLog.errors[1].should.equal(fileName + ' | line ' + line + ' | ' + message);
});

test('When invalid file is validated And user wants task to fail on error Then task does not pass', function(done){
	var oneFile = ['aFileName'],
		mockW3c = {
			validate : function(options){
				options.callback({
					messages : [{}]
				});
			}
		};
	W3cMarkupValidationPlugin.__set__("w3cValidator", mockW3c);

	new W3cMarkupValidationPlugin(new FakeLog()).validate({
		files: oneFile,
		validateOptions: {
			failOnError : true
		}
	}, function(passed){
		passed.should.be.false;
		done();
	});
});


