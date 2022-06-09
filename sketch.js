let sun // let is used so sun cannot be reassigned
let planets = []
let G = 100
let numPlanets = 5
let eccentric = 0.5




function setup() {
	createCanvas(windowWidth, windowHeight)
	sun = new body(100, createVector(0,0), createVector(0,0))

	for (let i =0; i < numPlanets; i++){
		
		// planet position
		let r = random(sun.r, min(windowWidth/2, windowHeight)) // radial distance from sun is min: sun radius and max: width of window
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
	background(180)
	for (let i = 0; i < planets.length; i++)	{
		sun.attract(planets[i])
		planets[i].update()
		planets[i].show()
	}
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
		stroke(30);
		for (let i = 0; i < this.path.length - 2; i++) {
			line(this.path[i].x, this.path[i].y , this.path[i+1].x , this.path[i+1].y)
		}
	}
	
	this.update = function(){ // increases postions by velocity vectors
		// update postion 
		this.pos.x += this.vel.x
		this.pos.y += this.vel.y
		this.path.push(this.pos.copy())
		if (this.path.length >500) { // keep path at constant length
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


