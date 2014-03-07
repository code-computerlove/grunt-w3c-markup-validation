var w3cValidator = require('w3cjs');

module.exports = function(){
	this.validate = function(){
		w3cValidator.validate();
	};
};