/*global webkitSpeechRecognition */

'use strict';

// check for support (webkit only)
if (!('webkitSpeechRecognition' in window))
	console.error('webkitSpeechRecognition not available');

var talkMsg = 'Speak now';
// seconds to wait for more input after last
var patience = 3;

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function startAnimation() {

	document.getElementById('circle').style.animationName = "mic";
	document.querySelectorAll('.bar').forEach(elt => elt.style.animationName = "bar-animation");

	anime({
		targets: "#listen",
		opacity: [0, 0.8],
		easing: 'easeOutExpo',
		top: ["20vh", "18vh"]
	});

}

function stopAnimation() {

	document.getElementById('circle').style.animationName = "none";
	document.querySelectorAll('.bar').forEach(elt => elt.style.animationName = "none");

	anime({
		targets: "#listen",
		opacity: [0.8, 0],
		easing: 'easeOutExpo',
		top: ["18vh", "16vh"]
	});

}

// setup recognition
var prefix = '';
var isSentence;
var recognizing = false;
var timeout;
var oldPlaceholder = null;
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "ta-IN";

function restartTimer() {

	timeout = setTimeout(function () {
		recognition.stop();
	}, patience * 1000);

}

recognition.onstart = function () {

	startAnimation();

	recognizing = true;
	restartTimer();

};

recognition.onend = function () {

	stopAnimation();

	recognizing = false;
	clearTimeout(timeout);

	showResult();

};

recognition.onresult = function (event) {

	clearTimeout(timeout);

	// get SpeechRecognitionResultList object
	var resultList = event.results;

	// go through each SpeechRecognitionResult object in the list
	var finalTranscript = '';
	var interimTranscript = '';
	for (var i = event.resultIndex; i < resultList.length; ++i) {
		var result = resultList[i];

		// get this result's first SpeechRecognitionAlternative object
		var firstAlternative = result[0];

		if (result.isFinal) {
			finalTranscript = firstAlternative.transcript;
		} else {
			interimTranscript += firstAlternative.transcript;
		}
	}

	// capitalize transcript if start of new sentence
	var transcript = finalTranscript || interimTranscript;
	transcript = !prefix || isSentence ? capitalize(transcript) : transcript;

	document.getElementById('output').innerHTML = prefix + transcript;

	restartTimer();
};

function buttonClick() {

	// stop and exit if already going
	if (recognizing) {

		recognition.stop();
		return;
	}

	// check if value ends with a sentence
	isSentence = prefix.trim().slice(-1).match(/[\.\?\!]/);

	// restart recognition
	recognition.start();
}


