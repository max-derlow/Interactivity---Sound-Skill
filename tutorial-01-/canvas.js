let canvas  = document.getElementById("graphics");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let context = canvas.getContext("2d");

let ballArray = {
	"ball0": {'radius': 30, 'colour': 'red', 'velocity': 10, 'mass': 10},
	"ball1": {'radius': 60, 'colour': 'green', 'velocity': 10, 'mass': 10},
	"ball2": {'radius': 90, 'colour': 'cyan', 'velocity': 10, 'mass': 10},
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
		this.velocity = velocity;
		this.mass = mass; //kg, let's say.
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

function draw() {
	//Clear the canvas
	context.clearRect(0,0,canvas.width, canvas.height);

	for(let i = 0; i <= Object.keys(ballArray).length -1; i++){
		let ball = window["ball" + String(i)];

		if(ball.x)
		//Move the ball - the ball gets fucky sometimes so still needs tweaking
		if(ball.x + (ball.radius/2) < canvas.width && ball.x - (ball.radius/2) > 0){
			ball.x += ball.velocity;
		} else { //change direction if out of bounds
			ball.velocity = ball.velocity * -1;
			ball.x += ball.velocity;
		}

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
				ball.velocity -= 0.2;
			}
		} else {
			if (ball.velocity > 0) {
				//ball.velocity -= 0.1;
			} else {
				ball.velocity += 0.2;
				//console.log(ball.velocity);
			}
		}

		// Test whether we hit an peak threshold (this can be a short burst of sound)
		hit = thresholdPeak(wave, 0.3);
		if (hit) {
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

createBalls();
requestAnimationFrame(draw);
