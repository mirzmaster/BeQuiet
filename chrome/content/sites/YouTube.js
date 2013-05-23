if (typeof com == "undefined") {
  var com = {};
}

com.sppad = com.sppad || {};
com.sppad.BeQuiet = com.sppad.BeQuiet || {};

/**
 * This consists of mostly a hugely ugly hack since adding an event listener for
 * the youtube flash api requires a function name rather than a function. As a
 * result, the function to listen for the state change has to be injected into
 * the page content using a script tag. In addition, the registration of the
 * listener has to be injected as well.
 * <p>
 * The injected code then creates an event that the add-on can listen for an use
 * accordingly.
 */
com.sppad.BeQuiet.YouTube = function(aBrowser) {
	
	const PLAYER_STATE_PLAYING = 1;
	
	let self = this;
	self.playing = undefined;
	
	this.isPlaying = function() {
		if(!self.initialized)
			return false;
		
		let state = self.doc.defaultView.wrappedJSObject.com_sppad_getState();
		return state == PLAYER_STATE_PLAYING;
	};
	
	this.play = function() {
		if(!self.initialized)
			return;
		
		self.doc.defaultView.wrappedJSObject.com_sppad_play();
	};
	
	this.pause = function() {
		if(!self.initialized)
			return;
		
		self.doc.defaultView.wrappedJSObject.com_sppad_pause();
	};
	
	this.stateChange = function(aEvent) {
		// event name is shared by all handlers, ensure its the same document
		if(aEvent.target != self.doc)
			return;
		
		let nowPlaying = self.isPlaying();

		// don't want to do onPause if going from one stopped state to another
		if(self.playing === nowPlaying)
			return;
		
		self.playing = nowPlaying;
		
		if(self.playing)
			self.onPlay();
		else
			self.onPause();
    };
	

    /**
	 * Allows access to the to the player controls and status by injecting a
	 * JavaScript node into the DOM. Need to use
	 * self.doc.defaultView.wrappedJSObject to access the functions.
	 */
	this.injectJavaScript = function() {
		let text = '\
			com_sppad_stateChangeListener = function(data) {\n\
			  var evt = document.createEvent("Events");\n\
			  evt.initEvent("com_sppad_ytStateChange", true, false);\n\
			  document.dispatchEvent(evt);\n\
			};\n\
			com_sppad_register = function() {\n\
			  document.getElementById("movie_player").addEventListener("onStateChange", "com_sppad_stateChangeListener");\
			};\n\
			com_sppad_getState = function() {\n\
			  return document.getElementById("movie_player").getPlayerState();\n\
			}\n\
			com_sppad_play = function() {\n\
			  return document.getElementById("movie_player").playVideo();\n\
			}\n\
			com_sppad_pause = function() {\n\
			  return document.getElementById("movie_player").pauseVideo();\n\
			}';
		
		let script = self.doc.createElement('script');
		let textNode = self.doc.createTextNode(text);
		
		script.appendChild(textNode);
		
		self.doc.body.appendChild(script);
	};
    
	this.initialize = function() {
		let moviePlayer = self.doc.getElementById('movie_player');
		
		return moviePlayer != null;
	};
	
	this.registerListeners = function() {
        document.addEventListener("com_sppad_ytStateChange", self.stateChange, false, true);
		
		self.injectJavaScript();
        
	    /*
		 * This doesn't work without the timeout. It seems that
		 * movie_player is not setup yet.
		 */
        window.setTimeout(function() {
    		self.doc.defaultView.wrappedJSObject.com_sppad_register();
            self.playing = self.isPlaying();
        }, 300);
	};
	
	this.unregisterListeners = function() {
	    document.removeEventListener("com_sppad_ytStateChange", self.stateChange);
	};
	
	this.base = com.sppad.BeQuiet.Handler;
	this.base(aBrowser, self);
}

com.sppad.BeQuiet.YouTube.prototype = Object.create(com.sppad.BeQuiet.Handler.prototype);
com.sppad.BeQuiet.YouTube.prototype.constructor = com.sppad.BeQuiet.YouTube;