
// Constants
// TODO: get constants from geogebra
const lambda = 1;

class vec2 {
	// Coordinates:
	x;
	y;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	// returns the length of the vector
	length() { return Math.sqrt(this.x * this.x + this.y * this.y) }
	// scales the vector by some factor k
	scale(k) { return new vec2(k * this.x, k * this.y) }
	// rotates the vector by alpha radians
	rotate(alpha) {
		// /x\ / cos(alpha)  -sin(alpha) \
		// \y/ \ sin(alpha)  cos(alpha)  /
		// ------------------------------
		// = ( x * cos(alpha) + y * (-sin(alpha)) ; x * sin(alpha) + y * cos(alpha) )
		const newX = this.x * Math.cos(alpha) - this.y * Math.sin(alpha);
		const newY = this.x * Math.sin(alpha) + this.y * Math.cos(alpha);
		
		return new vec2(newX, newY);
	}

	// adds to vectors
	static add(v1, v2) { return new vec2(v1.x + v2.x, v1.y + v2.y) }
	// calculates the distance between two vectors
	static dist(v1, v2) {
		// delta vector = v2 - v1 = v2 + (-1) * v1
		const dV = vec2.add(v2, v1.scale(-1));
		// return length of dV as distance
		return dV.length();
	}
}


// calculates the total distance travelled from v1 to v2 to v3
const totalDist = (v1, v2, v3) => ( vec2.dist(v1, v2) + vec2.dist(v2, v3) );

// angle of a vector with phase = totalDist(s, a, z) mod lambda
function getAlpha(s, a, z) {
	const dist = totalDist(s, a, z);
	// calculate the phase ('delta lambda')
	const dLambda = dist % lambda;
	// dLambda / lambda = alpha / 2PI
	return ( 2 * Math.PI * dLambda / lambda )
}


const v = new vec2(1, 0);
console.log(v.rotate(2 * Math.PI))
