var rewire = require('rewire'),
	W3cMarkupValidationPlugin = rewire('../tasks/src/markup-validator'),
	fakeLog = {
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

	new W3cMarkupValidationPlugin(fakeLog).validate({
		files: oneFile
	});
});