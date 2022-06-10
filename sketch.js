let sun // let is used so sun cannot be reassigned
let planets = []
let G = 50
let numPlanets = 8
let eccentric = 0.5
let moons = []
let numMoon = 5
let earth


function setup() {
	createCanvas(windowWidth, windowHeight)
	sun = new body(100, createVector(0,0), createVector(0,0))

	let r = random(sun.r, min(windowWidth/2, windowHeight/2)) // radial distance from sun is min: sun radius and max: width of window
	let theta = random(TWO_PI)
	let earthPos = createVector(r*cos(theta), r*sin(theta))

	// earth velocity
	let earthVel = earthPos.copy()
	earthVel.rotate(HALF_PI)
	earthVel.setMag(sqrt(G*sun.mass/earthPos.mag()))
	earth = new body(25,earthPos,earthVel)



	
	for (let i =0; i <numMoon; i++){

		
		let r = random(sun.r, min(windowWidth/2, windowHeight/2)) // radial distance from sun is min: sun radius and max: width of window
		let minDist = random(80,120)
		let moonPos = createVector(earthPos.x+minDist,earthPos.y+minDist)
		
		
			// moon velocity
		let moonVel = moonPos.copy()
		moonVel.rotate(HALF_PI)
		moonVel.setMag(sqrt(G*earth.mass/moonPos.mag()))
		moons.push  (new body(random(0.0001),moonPos,moonVel))

	}

	
	for (let i =0; i < numPlanets; i++){
		
		// planet position
		let r = random(sun.r, min(windowWidth/2, windowHeight/2)) // radial distance from sun is min: sun radius and max: width of window
		let theta = random(TWO_PI)
		let planetPos = createVector(r*cos(theta), r*sin(theta))
		

		//planet velocity
		let planetVel = planetPos.copy()
		planetVel.rotate(HALF_PI)
		planetVel.setMag(sqrt(G*sun.mass/planetPos.mag()))
		planetVel.mult(random( 1-eccentric , 1+eccentric) )
		planets.push (new body(random(10,30), planetPos, planetVel))
	}
	
}

function draw() {
	translate(width/2,height/2)
	background(45)
	for (let i = 0; i < planets.length; i++)	{
		sun.attract(planets[i])
		planets[i].update()
		planets[i].show()
	}
	for(let i = 0; i < moons.length; i++){
		earth.attract(moons[i])
		moons[i].update()
		moons[i].show()
	}
	sun.attract(earth)
	earth.update()
	earth.show()
	sun.update()
	sun.show()
}

function body(mass,pos,vel){ // function to assign characteristics to bodies
	this.mass = mass // assign mass
	this.pos = pos // assign position
	this.vel = vel // assign velocity
	this.r = this.mass // assign radius
	this.path = [] 

	this.show = function(){
		noStroke(); fill(255);
		ellipse(this.pos.x,this.pos.y,this.r,this.r) // creates an ellipse with position (x,y) and radius x,y = r
		stroke(255);
		for (let i = 0; i < this.path.length - 2; i++) {
			line(this.path[i].x, this.path[i].y , this.path[i+1].x , this.path[i+1].y)
		}
	}
	
	this.update = function(){ // increases postions by velocity vectors
		// update postion 
		this.pos.x += this.vel.x
		this.pos.y += this.vel.y
		this.path.push(this.pos.copy())
		if (this.path.length >50) { // keep path at constant length
			this.path.splice (0,1)
		}
	}

	this.applyForce = function(f) {  
		this.vel.x += f.x/this.mass //f=ma +> a = f/m
		this.vel.y += f.y /this.mass
	}

	this.attract = function(child) {
		let r = dist(this.pos.x,this.pos.y,child.pos.x,child.pos.y)
		let f = this.pos.copy().sub(child.pos)
		f.setMag(G * this.mass* child.mass / (r*r))
		child.applyForce(f)
	}
}


