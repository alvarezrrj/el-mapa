module.exports = function(grunt) {
	//Project config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		postcss: {
			defaults: {
				options: {
					map: true,
					processors: [
						require('autoprefixer')(), //Vendor prefixes
					],
					src: 'src/*.css',
					dest: 'css/el-mapa-tyles.css',
				},
			},
		},
		watch: {
			files: ['<%= postcss.dist.src %>'],
			tasks: ['postcss'],
		},
	});

	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['postcss']);
	
};
