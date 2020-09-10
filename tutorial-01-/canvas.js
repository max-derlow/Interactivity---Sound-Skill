let canvas  = document.getElementById("graphics");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let context = canvas.getContext("2d");
let localFreq;
let audioCtx, analyser, ampWindow, freqWindows;

class Ball {
	constructor() {
		this.x = 40;
		this.y = 200;
		this.size = 100;
		this.radius = 30;
		this.colour = 'blue';
		this.velocity = 10;
	}
}

let ball = new Ball();

/*
function animate() {
    reqAnimFrame =  window.mozRequestAnimationFrame    || //get framerate
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame     ||
        window.oRequestAnimationFrame
    ;
    reqAnimFrame(animate);


    if(radius <= 300) {
        radius +=3;
    } //increase size by 1 per frame

    draw();
}
*/

function behaviour() {
	// ---- Process the data first
	const bins = analyser.frequencyBinCount;
	var freq = new Float32Array(bins);
	var wave = new Float32Array(bins);
	analyser.getFloatFrequencyData(freq);
	analyser.getFloatTimeDomainData(wave);
  
	// Get the min, max & average of this slice of waveform data
	// max: absolute max, min: absolute min, avg: average of absolute data
	let waveD = getMinMaxAvg(wave);
	ampWindow.add(waveD.avg); // Keep track of average readings over time
  
	// Track each frequency bin
	for (var i = 0; i < analyser.fftSize / 2; i++) {
	  freqWindows[i].add(freq[i]);
	}
}

function draw() {
	if (globalFreq != null){localFreq = globalFreq[0];}
	//context.save();
	context.clearRect(0,0,canvas.width, canvas.height);
	if(ball.x + ball.velocity != canvas.width){
		ball.x += ball.velocity;
	}

	if(ball.x + ball.radius > canvas.width){
		ball.x = 0;
	}
	context.beginPath();
	context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
	context.fillStyle = ball.colour;
	context.fill();

	//context.restore();

	requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
