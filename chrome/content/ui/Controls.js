"use strict";

Components.utils.import("chrome://BeQuiet/content/ns.jsm");

BeQuiet.Controls = new function() {
	let self = this;
	
	self.playing = false;
	
	self.setButtonState	 = function(playing) {
		let control = window.document.getElementById('com_sppad_beQuiet_media_playPause');
		
		if(!control)
			return;
		
		if(playing)
			control.setAttribute('playing', true);
		else
			control.removeAttribute('playing');
	};
	
	self.updateToggleTooltip = function(aEvent) {
		aEvent.target.setAttribute('label', self.playing ? 'Pause' : 'Play');
	};
	
	self.setControlsEnabled = function(enabled) {
	 	let controls = window.document.getElementsByClassName('com_sppad_beQuiet_mediaControl');
    	for(let control of controls) {
    		if(enabled)
    			control.removeAttribute('disabled');
    		else
    			control.setAttribute('disabled', true);
    	}
	};
	
	self.isPlaying = function() {
		return self.playing;
	};
	
	self.onPlay = function(aEvent) {
		self.playing = true;
		self.setButtonState(true);
	};
	
	self.onPause = function(aEvent) {
		self.playing = false;
		self.setButtonState(false);
	};
	
	self.play = function() {
		BeQuiet.MediaState.play();
	};
	
	self.pause = function() {
		BeQuiet.MediaState.pause();
	};
	
	self.toggle = function() {
		if(self.playing)
			self.pause();
		else
			self.play();
	};
	
	self.next = function() {
		BeQuiet.MediaState.next();
	};
	
	self.previous = function() {
		BeQuiet.MediaState.previous();
	};
	
	window.addEventListener('load', function() {
		BeQuiet.MediaState.addObserver(self);
	});

	window.addEventListener('unload', function() {
		BeQuiet.MediaState.removeObserver(self);
	});
};