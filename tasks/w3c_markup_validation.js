var MarkupValidator = require('./src/markup-validator');

module.exports = function(grunt) {
    var markupValidator = new MarkupValidator(grunt.log);

    grunt.registerMultiTask('w3c_markup_validation', 'Grunt task for W3C validation of markup', function() {
        var done = this.async();
        markupValidator.validate(this.data, done);
  });
};
