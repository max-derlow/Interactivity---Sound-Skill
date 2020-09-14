let canvas  = document.getElementById("graphics");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let context = canvas.getContext("2d");
let localFreq;
//let audioCtx;
//let analyser;
let ampWindow;
let freqWindows;

class Ball {
	constructor() {
		this.i = 0; //amount of times the ball has refreshed while in the air
		this.i2 = 0;
		this.r = 0; //friction;
		this.x = 40;
		this.y = 0;
		this.radius = 30;
		this.colour = 'blue';
		this.velocity = 10;
		this.mass = 10; //kg, let's say.
	}
}

let ball = new Ball();

function draw() {
	//Clear the canvsa
	context.clearRect(0,0,canvas.width, canvas.height);

	//Move the ball
	if(ball.x + (ball.radius/2) < canvas.width && ball.x - (ball.radius/2) > 0){
		ball.x += ball.velocity;
	} else { //change direction if out of bounds
		ball.velocity = ball.velocity * -1;
		ball.x += ball.velocity;
	}

// the ball is bouncing left and right
	if(ball.x + ball.radius >= canvas.width || ball.x <= 0) {

		//ball.r = (ball.r * -1);
	}

	// the ball is falling
	if(ball.y + ball.radius <= canvas.height) {
		ball.i -= 1;
		ball.y = ball.y - ball.i;
	}

	// if it hits the floor, stop falling
	else if(ball.y + ball.radius >= canvas.height){
		ball.y = canvas.height - ball.radius;
		ball.i = 0;
		//ball.r += 0.001;
		//ball.velocity = ball.velocity +- ball.r; doesn't work but fuck is that funny
	}
	// apply friction
	if(ball.velocity >= 0){
		ball.velocity -= ball.r;
	}
	// ensure we don't get negative velocity
	else if(Math.abs(ball.velocity) <= 0.8){
		ball.r = 0.5;
		ball.velocity = 0.5;
		console.log("killed dead");
	}

	context.beginPath();
	context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
	context.fillStyle = ball.colour;
	context.fill();

	//context.restore();

	requestAnimationFrame(draw);
}

function onResize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function analyse() {
	const bins = analyser.frequencyBinCount;
  
	// Get frequency and amplitude data
	const freq = new Float32Array(bins);
	const wave = new Float32Array(bins);
	analyser.getFloatFrequencyData(freq);
	analyser.getFloatTimeDomainData(wave);
  
	globalFreq = freq; //hook for freq to be global
  
	// Test whether we hit a threshold between 0-80Hz (bass region)
	var hit = thresholdFrequency(0, 95, freq, -70);
	if (hit) {
		ball.velocity -=1;//document.getElementById('freqTarget').classList.add('hit');
	}
  
	// Test whether we hit an peak threshold (this can be a short burst of sound)
	hit = thresholdPeak(wave, 0.5);
	if (hit) {
	  ball.colour = 'red';//document.getElementById('peakTarget').classList.add('hit');
	} else {
		ball.colour = 'blue';
	}
  
	// Test whether we hit a sustained (average) level
	// This must be a longer, sustained noise.
	hit = thresholdSustained(wave, 0.3);
	if (hit) {
	  ball.radius++//document.getElementById('susTarget').classList.add('hit');
	} else if (ball.radius>50) {
	  ball.radius--
	}
  
	// Optional rendering of data
	//visualiser.renderWave(wave, true);
	//visualiser.renderFreq(freq);
  
	// Run again
	window.requestAnimationFrame(analyse);
  }

requestAnimationFrame(draw);