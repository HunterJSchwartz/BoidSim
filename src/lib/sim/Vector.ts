export class Vector {
	x: number;
	y: number;

	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	Add(vec: Vector): Vector {
		return new Vector(this.x + vec.x, this.y + vec.y);
	}

	Sub(vec: Vector): Vector {
		return new Vector(this.x - vec.x, this.y - vec.y);
	}

	Mult(val: number): Vector {
		return new Vector(this.x * val, this.y * val);
	}

	Div(val: number): Vector {
		return new Vector(this.x / val, this.y / val);
	}

	GetMag(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	Normalize(): Vector {
		const mag = this.GetMag();
		if (mag === 0) {
			return this;
		}
		return this.Div(mag);
	}

	Limit(val: number): Vector {
		const mag: number = this.GetMag();
		if (mag < val) {
			return this;
		} else {
			return this.Normalize().Mult(val);
		}
	}

	Distance(vec: Vector): number {
		const xDist = (this.x - vec.x) * (this.x - vec.x);
		const yDist = (this.y - vec.y) * (this.y - vec.y);
		return Math.sqrt(xDist + yDist);
	}

	Equals(vec: Vector): boolean {
		return this.x === vec.x && this.y === vec.y;
	}
}
