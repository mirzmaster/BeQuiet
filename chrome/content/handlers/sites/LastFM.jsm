"use strict";

var EXPORTED_SYMBOLS = [];

Components.utils.import("chrome://BeQuiet/content/ns.jsm");
Components.utils.import("chrome://BeQuiet/content/handlers/NodeBasedHandler.jsm");

BeQuiet.LastFM = function(aBrowser) {
	const description = {
	    control: {
	     	play:  '#radioControlPlay',
	     	pause: '#radioControlPause',
	     	next:  '#radioControlSkip',
	     	like:  '#radioControlLove'
	    },
	    	     
	    status: {
	    	playing: {
	    		selector:  '#webRadio',
	      		attrName:  'class',
	      		testValue: /playing/
	     	},
	     
	     	liked: {	
	      		selector:  '#radioPlayer',
      			attrName:  'class',
	      		testValue: /loved/
	     	},
	    }
	};
	
	let self = this;
	
	self.base = BeQuiet.NodeBasedHandler;
	self.base(aBrowser, description);
};

BeQuiet.LastFM.prototype = Object.create(BeQuiet.NodeBasedHandler.prototype);
BeQuiet.LastFM.prototype.constructor = BeQuiet.LastFM;