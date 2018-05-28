module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		skinPath: {
			css: "build/css",
			scss: "src/scss"
		},
		//uglify压缩插件
		uglify: {
			options: {
				stripBanners: false,
				banner: '/*!<%-pkg.name%>-<%-pkg.version%> <%-grunt.template.today("yyyy-mm-dd")%>*/\n'
			},
			build: { //任务1：压缩src/js目录下所有js文件并输出到build/js目录下
				files: [{
						expand: true,
						cwd: 'js/controllers', //js目录下
						src: '*.js', //所有js文件
						dest: 'app/controller/js' //输出到此目录下
					}
					/*,{
										expand: true,
										cwd: 'app/js', //js目录下
										src: '*.js', //所有js文件
										dest: 'app/js/js' //输出到此目录下
									}*/
				]
			}
		},
		//jshint插件配置信息
		jshint: {
			bulid: ['Gruntfile.js', 'js/controllers/*.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		cssmin: {
			css: {
				src: 'css/*.css',
				dest: 'css/custom/customcss.min.css'
			}
		},
		//csshint插件配置信息
		csslint: {
			build: ['css/*.css'],
			options: {
				csslintrc: '.csslintrc'
			}
		},
		watch: {
			bulid: {
				files: ['*.js', '*.html', 'js/*js', 'js/controllers/*js', 'js/directives/*js', 'js/filters/*js', 'js/services/*js', 'css/*.css', 'views/*.html'],
				tasks: ['cssmin', 'jshint', 'csslint' /* 'uglify',   */ ],
				options: {
					spawn: false
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.registerTask('default', ['jshint', /*'uglify',*/ 'cssmin', /*'csslint',*/ 'watch']);
};