var radio;
var mbps;
var val;
var loadFirst = 0;
var difference;
var intro;
var sprite = [];

function preload() {
	mbps = loadJSON("netspeeds.json");
};

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100, 200, 255);

	fill(70);
	rect(0, 0, windowWidth, 200);

	fill(255);
	textSize(100);
	text("https://netneutrality", 300, 150);

	radio = createRadio();
	radio.option("September 2013", 0);
	radio.option("October 2013  ", 1);
	radio.option("November 2013 ", 2);
	radio.option("December 2013 ", 3);
	radio.option("January 2014  ", 4);
	radio.option("February 2014 ", 5);
	radio.option("March 2014 ...", 6);
	radio.option("April 2014    ", 7);
	radio.position(10, 300);
	radio.style("width", "140px");
	radio.style("font-family", "arial");
	textAlign(CENTER);

	for (var i = 0; i < 277; i++) {
		sprite[i] = new Sprite();
	};
};

function draw() {
	createCanvas(windowWidth, windowHeight);
	background(100, 200, 255);

	noStroke();
	fill(50, 180, 240);
	rect(0, windowHeight - 20, windowWidth, 23);//floor. Purely asthetic; the sprites don't collide directly.

	fill(70);
	rect(0, 0, windowWidth, 200);

	fill(255);
	textSize(100);
	text("https://netneutrality", 300, 150);

	val = radio.value();

	for (var i = 0; i < sprite.length; i++) {
		sprite[i].fall();
		sprite[i].display();
	};

	if (val) {
		for (var i = 0; i < parseFloat(mbps.netflix[val].speed.toFixed(2)) * 100; i++) {
			sprite[i].floor = "down";
		};
		for (var i = parseFloat(mbps.netflix[val].speed.toFixed(2)) * 100 + 1; i < sprite.length; i++) {
			sprite[i].floor = "up";
		};
	} else {
		textSize(30);
		fill(230);
		text("In October 2013, Netflix's speed on Comcast began slowing. Comcast was throttling its", 200,400);
		text("consumers' access to Netflix to coerce the company into a network deal. In February", 200, 430);
		text("2014, Netflix agreed to the deal, and its speed on Comcast skyrocketed, even exceeding",200,460);
		text("its original speed in Septembr. It peaked in April 2014 at 2.77 mbps.", 200, 490);
	};
};

//throws the sprites that have fallen
function keyPressed() {
	for (var i = 0; i < 277; i++) {
		sprite[i].tossed();
	};
};

function displaySpeed() {
	textSize(50);
	fill(230);
	text(`Netflix's speed was ${mbps.netflix[val].speed} mbps that month,`, 200, 300);
	text(`${difference.toFixed(2)} mbps less than its peak in April.`, 200, 350);
	textSize(25);
	text("One block represents 100 kilobytes.", 200, 400);
	text("Press any key to toss the blocks.", 200, windowHeight - 70);
};

function Sprite() {
	this.x = random(0, windowWidth-40); //sprite's x position
	this.y = random(5, 160); //y position
	this.step = 20; //how fast they move left and right. Not currently being used.
	this.xVelocity = 0; //used for left/right movement. Not in use.
	this.intertia = 1; //how fast the sprite accelerates/deccelerates. Not in use.
	this.yVelocity = 0; //used for falling.
	this.gravity = 1; //Higher gravity = greater acceleration
	this.direction = "none"; //used to denote which way the sprite faces. Not in use.
	this.xToss = 20; //max speed sprite can be thrown in either direction. Not in use.
	this.yToss = 30; //max height sprite can be thrown.
	this.bounce = 0.8;
	this.floor = "up";

	//draws the sprite
	this.display = function() {
		fill(255, 0, 150, 50);
		stroke(255);
		strokeWeight(5);
		rect(this.x, this.y, 40, 40, 10);
	};

	//invokes gravity. As long as the sprite is not on the "ground," it falls faster and faster.
	this.fall = function() {
		if (this.floor === "down") {
			if (this.y + this.yVelocity >= windowHeight - 63) {
				this.y = windowHeight - 63;
				if (this.yVelocity > 1) {
					this.yVelocity = -this.yVelocity * this.bounce;
				} else {
					this.yVelocity = 0;
				};
			} else {
				this.yVelocity += this.gravity;
				this.y += this.yVelocity;
			};
		} else if (this.floor === "up") {
			if (this.y + this.yVelocity <= 0) {
				this.y = 0;
				if (this.yVelocity < 1) {
					this.yVelocity = -this.yVelocity * this.bounce;
				} else {
					this.yVelocity = 0;
				};
			} else {
				this.yVelocity -= this.gravity;
				this.y += this.yVelocity;
			};
		};
	};

	//for when the sprite can be moved left/right.
	//if it goes too far in one direction it appears on the other side of the screen.
	this.touchingEdge = function() {
		if (this.x < -70) {
			this.x = windowWidth;
		};

		if (this.x > windowWidth) {
			this.x = -70;
		};
	};

	//doesn't do anything right now. Needs to be re-written.
	this.leftRight = function() {
		if (this.y === windowHeight - 63) {
			if (this.direction === "left") {
				this.x += this.xVelocity * 0.5;

				if (this.xVelocity < 0) {
					this.xVelocity += this.intertia;
				} else {
					this.xVelocity = 0;
				};

			} else if (this.direction === "right") {
				this.x += this.xVelocity * 0.5;

				if (this.xVelocity > 0) {
					this.xVelocity -= this.intertia;
				} else {
					this.xVelocity = 0;
				};
			};
		};
		this.x += this.xVelocity;
	};

	//gives every sprite a random x and y velocity to throw them around.
	this.tossed = function() {
		if (this.floor === "down") {
			this.yVelocity = random(-12, -this.yToss);
		} else if(this.floor === "up") {
			this.yVelocity = random(12, this.yToss);
		}
	};
};


	// if (val) {
	// 	for (let i = 0; i < parseFloat(mbps.netflix[val].speed.toFixed(2)) * 100; i++) {
	// 		sprite[i] = new Sprite();
	// 	};
	// 	difference = 2.77 - mbps.netflix[val].speed;

	// 	console.log(mbps.netflix[val].speed);
	// 	displaySpeed();	

	// 	for (let i = 0; i < sprite.length; i++) {
	// 		sprite[i].display();
	// 		sprite[i].fall();
	// 	};
	// 	loadFirst = 1;
	// } else {
	// };
	// if (loadFirst === 0) {
	// 	for (let i = 0; i < 277; i++) {
	// 		sprite[i] = new Sprite();
	// 	};
	// 	for (let i = 0; i < sprite.length; i++) {
	// 		sprite[i].display();
	// 		sprite[i].fall();
	// 	};
	// };