module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                node: true,
                globals: {},
                white: true,
                indent: 2,
                camelcase: true,
                eqeqeq: true,
                eqnull: true,
                quotmark: true,
                expr: true,
                latedef: true
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    timeout: 5000
                },
                src: ['test/**/*.js']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.registerTask('default', ['jshint', 'mochaTest']);
};