let canvas  = document.getElementById("graphics");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let context = canvas.getContext("2d");

let ballArray = {
	"ball0": {'radius': 30, 'colour': 'red', 'velocity': 10, 'mass': 10},
	"ball1": {'radius': 60, 'colour': 'green', 'velocity': 6, 'mass': 10},
	"ball2": {'radius': 90, 'colour': 'cyan', 'velocity': 2, 'mass': 10},
};

//Fix so these are generated programatically instead.
let ghostBallArray = {
	"ghostBall0":  {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall1":  {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall2":  {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall3":  {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall4":  {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall5":  {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall6":  {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall7":  {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall8":  {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall9":  {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall10": {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall11": {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall12": {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall13": {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall14": {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall15": {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall16": {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall17": {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall18": {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall19": {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall20": {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall21": {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall22": {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall23": {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall24": {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall25": {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
	"ghostBall26": {'radius': 20, 'colour': 'rgba(255, 0, 255,', 'velocity': 10, 'mass': 10},
};


class Ball {
	constructor(radius, colour, velocity, mass) {
		this.i = 0; //amount of times the ball has refreshed while in the air
		this.i2 = 0;
		this.r = 0; //friction;
		this.x = 40;
		this.y = 0;
		this.radius = radius;
		this.colour = colour;
		this.opacity = 1;
		this.velocity = velocity;
		this.mass = mass; // kg
	}

	exampleMethod(){} // Because I'm * and will forget if I don't write it here.
}

//let ball = new Ball();

// create all ball objects
function createBalls() {
	console.log(Object.keys(ballArray));
	for(let i = 0; i <= Object.keys(ballArray).length -1; i++){
		console.log(String(i));
		let ball = "ball" + String(i);
		let ballProp = ballArray["ball" + String(i)];
		window[ball] = new Ball(ballProp.radius, ballProp.colour, ballProp.velocity, ballProp.mass);
	}
}

//create all ghost ball objects
function createGhostBalls(){
	console.log(Object.keys(ghostBallArray));
	for(let i = 0; i <= Object.keys(ghostBallArray).length -1; i++){
		console.log(String(i));
		let ball = "ghostBall" + String(i);
		let ballProp = ghostBallArray["ghostBall" + String(i)];
		window[ball] = new Ball(ballProp.radius, ballProp.colour, ballProp.velocity, ballProp.mass);
	}
}

function draw() {
	//Clear the canvas
	context.clearRect(0,0,canvas.width, canvas.height);

	for(let i = 0; i <= Object.keys(ballArray).length -1; i++){
		let ball = window["ball" + String(i)];

		if(ball.x <= 0){
			ball.x = 0 + ball.radius;
			ball.velocity = ball.velocity * -1;
			console.log("changing direction");
		} else if (ball.x >= canvas.width){
			ball.x = canvas.width - ball.radius;
			ball.velocity = ball.velocity * -1;
		} else {
			ball.x += ball.velocity;
		}
		/*
		//Move the ball - the ball gets funky sometimes so still needs tweaking
		if(ball.x + (ball.radius) < canvas.width && ball.x - (ball.radius) > 0){
			ball.x += ball.velocity;
		} else { //change direction if out of bounds
			ball.velocity = ball.velocity * -1;
			ball.x += ball.velocity;
		}
*/
		if(ball.velocity >= 40){
			ball.velocity = 40;
			console.log(ball.velocity);
		} else if(ball.velocity <= -40){
			ball.velocity = -40;
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
		else if(Math.abs(ball.velocity) <= 0.05){
			ball.r = 0.5;
			ball.velocity = 0.5;
			console.log("killed dead");
		}

		context.beginPath();
		context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
		context.fillStyle = ball.colour;
		context.fill();
	}
	requestAnimationFrame(draw);
	requestAnimationFrame(drawGhostBalls);
}

//Handles the 'runCounter' which affects the opacity of ghost balls. Real fokkin' spaghetti code but w/e.
let runCounter = 0;
let runDirection = '+';
function handleRunCounter(){
	if(runDirection === '+' && runCounter < 100){
		runCounter += 1;
	} else if(runDirection === '+'&& runCounter >= 100){
		runCounter -= 1;
		runDirection = '-';
	}

	if(runDirection === '-' && runCounter > 0){
		runCounter -= 1;
	} else if(runDirection === '-'&& runCounter <= 0){
		runCounter += 1;
		runDirection = '+';
	}

	return runCounter;
}

//handle velocity - maybe or maybe not. doesn't seem optimal.
function handleVelocity(ball, velocityDelta){
	if(ball.velocity > 0) {
		ball.velocity += velocityDelta;
		ball.x += ball.velocity;
	} else if (ball.velocity < 0) {
		ball.velocity -= velocityDelta;
		ball.x -= ball.velocity;
	}
}

function drawGhostBalls(){
	let opacity = 1;

	for(let i = 0; i <= Object.keys(ghostBallArray).length -1; i++) {
		let ball = window["ghostBall" + String(i)];
		if(pulsed){
			ball.x = Math.floor(Math.random() * canvas.width);
			ball.y = Math.floor(Math.random() * canvas.height);
		}
		context.beginPath();
		context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
		context.fillStyle = ball.colour + opacity + ")";
		context.fill();
	}
}


function onResize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function handleBehaviour(ball, behaviour, intensity){
	switch (behaviour){
		case "jumping": //BPM is j
			behaviour = "jumping";
			ball.i += intensity;
			break;
		case "velocity": //Amplitude threshhold - velocity
			behaviour = "velocity";
			ball.velocity += intensity;
			break;
		case "radius": // Amplitude sustained - size
			behaviour = "radius";
			ball.radius += intensity;
			break;
		case "opacity": //BPM is opacity - when looking at ghost balls
			behaviour = "opacity";
			ball.opacity += intensity;
			break;
		case "colour": //Somewhere
			behaviour = "colour";
			ball.colour += intensity;
			break;
		case "position": //Somewhere
			behaviour = "position";
			ball.colour += intensity;
			break;
	}
}

function analyse() {
	const bins = analyser.frequencyBinCount;
  
	// Get frequency and amplitude data
	const freq = new Float32Array(bins);
	const wave = new Float32Array(bins);
	analyser.getFloatFrequencyData(freq);
	analyser.getFloatTimeDomainData(wave);
  
	globalFreq = freq; //hook for freq to be global DOESN'T WORK. WHY????
  
	// Test whether we hit a threshold between 0-80Hz (bass region)
	for(let i = 0; i <= Object.keys(ballArray).length -1; i++) {
		let ball = window["ball" + String(i)];
		let hit = thresholdFrequency(0, 95, freq, -70);

		if (hit) {
			//ball.velocity -=1;//document.getElementById('freqTarget').classList.add('hit');
			if (ball.velocity > 0) {
				ball.velocity += 0.1;
			} else {
				ball.velocity -= 0.1;
			}
		} else {
			if (ball.velocity > 0) {
				ball.velocity -= 0.1;
			} else {
				ball.velocity += 0.1;
				//console.log(ball.velocity);
			}
		}

		// Test whether we hit an peak threshold (this can be a short burst of sound)
		hit = thresholdPeak(wave, 0.3);
		if (hit) {
			// Behaviour(ball.behaviour, ball.intensity)
			ball.y -=40;//document.getElementById('peakTarget').classList.add('hit');
		} else {
			//ball.colour = 'blue';
		}

		hit = thresholdSustained(wave, 0.3);
		if (hit) {
			ball.radius++;//document.getElementById('susTarget').classList.add('hit');
		} else if (ball.radius>50) {
			ball.radius--;
		}
	}
	window.requestAnimationFrame(analyse);
  }

function drawBigBall(){
	context.beginPath();
	context.arc(canvas.width + (runCounter * 4), canvas.height, (canvas.height/2), 0, 2 * Math.PI, false);
	context.fillStyle = "rgba(255,153,51,0.75)";
	context.fill();
}

drawBigBall();
createBalls();
createGhostBalls();
requestAnimationFrame(draw);
