grunt-w3c-markup-validation
===========================
[![Build Status](https://travis-ci.org/code-computerlove/grunt-w3c-markup-validation.png)](https://travis-ci.org/code-computerlove/grunt-w3c-markup-validation)

Grunt task for W3C validation of markup

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-w3c-markup-validation --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-w3c-markup-validation');
```

## Using the task

This task can be used to validate markup in local files or hosted in a site.
Here is an example of it's use within a grunt file:

```javascript
      grunt.initConfig({
        w3c_markup_validation : {
  				failOnError : true,
  				pages : ['./test-pages/fails.html', 'http://www.google.com'],
  				ignore : ['no document type delaration']
  			}
			});
			
			task('default', ['w3c_markup_validation']);
```

### options 
| name | description |
| ---- | ----------- |
| pages | the pages to validate |
| failOnError | should grunt stop if an error is encountered? (default is false) |
| ignore | ignore any errors containing the specified text |

