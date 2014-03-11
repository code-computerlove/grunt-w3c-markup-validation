module.exports = function(grunt) {
	var message = grunt.option('m') || 'no commit message :(';
	
	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-git');
	grunt.loadNpmTasks('grunt-shell');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: ["./**/*.js"],
			options: {
				ignores: ["./node_modules/**/*.js"]
			}
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'nyan',
					recursive: true,
					ui: 'tdd'
				},
				src: ["test/**/*.js"]
			}
		},
		gitcommit: {
			your_target: {
				options:{
					message: message
				},
				src: ['.']
			}
		}, 
		shell: {
			git_push: {
				command: 'git push'
			}
		},
		w3c_markup_validation : {
			options : {
				pages : ['http://www.google.com/']
			}
		}
	});

	grunt.registerTask('acceptance', ['w3c_markup_validation']);
	grunt.registerTask('test', ['mochaTest','jshint']);
	grunt.registerTask('default',['test','gitcommit', 'shell:git_push']);
};