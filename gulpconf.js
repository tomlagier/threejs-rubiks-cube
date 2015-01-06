module.exports = {
	"build": "./target",
	"src": "./src",
	"source": {
		"prod": ["**", "!assets/scss{,/**}", "!assets/js{,/**}"],
		"dev": ["**"]
	},
	"sprites": {
		"icons": "<%= src %>/assets/images/sprites/icons/*.png"
	},
	"js": {
		"<%= src %>/assets/js/libs/*.js": "<%= build %>/assets/js/vendor.js",
		"<%= src %>/assets/js/src/*.js": "<%= build %>/assets/js/app.js",
	},
	"css": {
		"<%= build %>/assets/css/": ["<%= src %>/assets/scss/*.scss"]
	}
};
