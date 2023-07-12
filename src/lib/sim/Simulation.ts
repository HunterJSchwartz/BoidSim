import { Vector } from './Vector.js';
import { Boid } from './Boid.js';
import type { Application } from 'pixi.js';

export type BoidSettings = {
	visionRad: number;
	maxSpeed: number;
	containForce: number;
	pullForce: number;
	centerForce: number;
	alignForce: number;
	cohesionForce: number;
	seperationForce: number;
	avoidForce: number;
	size: number;
};

const sets: BoidSettings = {
	visionRad: 50,
	maxSpeed: 5,
	containForce: 0.5,
	pullForce: 0.5,
	centerForce: 0.00005,
	alignForce: 0.2,
	cohesionForce: 0.03,
	seperationForce: 0.075,
	avoidForce: 0.25,
	size: 0.05
};

let boids: Boid[];
let width: number;
let height: number;

function Initialize(count: number, canvasWidth: number, canvasHeight: number, scene: Application) {
	boids = [];
	width = canvasWidth;
	height = canvasHeight;

	for (let i = 0; i < count; i++) {
		const pos = GetRandomPos(width, height);
		const vel = GetRandomVel(sets.maxSpeed);
		const acc = new Vector(Math.random(), Math.random());
		const boid = new Boid(pos, vel, acc, sets, scene, width, height);
		boids.push(boid);
	}
}

function UpdateBoids(delta: number): void {
	for (let i = 0; i < boids.length; i++) {
		boids[i].Update(boids, delta);
	}
}

function GetRandomPos(width: number, height: number): Vector {
	return new Vector(Math.random() * width, Math.random() * height);
}

function GetRandomVel(maxSpeed: number): Vector {
	return new Vector((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2).Mult(
		Math.random() * (maxSpeed - 0.5) + 0.5
	);
}

export { Initialize, UpdateBoids };
