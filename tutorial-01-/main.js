//Setup canvas
const canvas = document.getElementById("graphics");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
const context = canvas.getContext("2d");

//Set styles
context.fillStyle = 'green';
context.strokeStyle = 'rgb(0, 0, 0)';

//
//Variable for tree
let treeSize = 50;

//Variables for controlling randomness
let isRandom = true;
let maxRadian = Math.PI / 4;

let minHeightFactor = 0.5;
let maxHeightFactor = 0.9;

//Variable to hold last place mouse was clicked
let lastX = canvas.width/2;
let lastY = canvas.height/2;

//Handle mouse events
function handleMouseClick(event) {
	//Draw a rectangle covering the canvas => fog effect
	context.fillRect(0, 0, canvas.width, canvas.height);

	//Set last position variables
	lastX = event.clientX;
	lastY = event.clientY;

	//Draw frame
		window.requestAnimationFrame(draw);
}

//Set event handlers
document.addEventListener("click", handleMouseClick, false);

function drawBranch (height){
	//Set width of branch
	context.lineWidth = height / 20;

	//Draw branch
	context.beginPath();
	context.arc(x, y, radius, 0, 2 * Math.PI, false);
	context.stroke();

	//If branch is not "too small" draw two more
	if (height > 10){
		//Move to the end of the branch
		context.translate(0, - height);

		//Draw first branch
		context.save();
		if (isRandom){
			context.rotate(- maxRadian * Math.random());
			drawBranch(height * (minHeightFactor + (maxHeightFactor - minHeightFactor) * Math.random()));
		} else {
			context.rotate(- maxRadian);
			drawBranch(height * 0.7);
		}
		context.restore();


		//Draw second branch
		context.save();
		if (isRandom){
			context.rotate(maxRadian * Math.random());
			drawBranch(height * (minHeightFactor + (maxHeightFactor - minHeightFactor) * Math.random()));
		} else {
			context.rotate(maxRadian);
			drawBranch(height * 0.7);
		}
		context.restore();
	}
}

//Draw a tree
function drawTree(x,y){
	let treePerspective = 5;

	//Save matrix and move to position
	context.save();
	context.translate(x,y);
	if(isRandom){
 		context.rotate(maxRadian / 6 - maxRadian / 3 * Math.random());
	}


	//Draw branch
	drawBranch(y / treePerspective);

	//Restore position
	context.restore();
}

//Draw function (called by handleMouseClick)
function draw() {
 drawTree(lastX, lastY);
}