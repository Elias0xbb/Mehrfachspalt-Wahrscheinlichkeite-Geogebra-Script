
// Constants
const nSpalte = ggbApplet.getValue('SpaltAnzahl')
const spaltBreite = ggbApplet.getValue('SpaltBreite')
const spaltAbstand = ggbApplet.getValue('Spaltabstand')
const punkteProSpalt = ggbApplet.getValue('StartpunkteProSpalt')
const lambda = ggbApplet.getValue('lambda')
const dist = ggbApplet.getValue('Distanz')
const schirmbreite = ggbApplet.getValue('Schirmbreite')
const nA = ggbApplet.getValue('LichtWegpunkte')
const precision = ggbApplet.getValue('CornuspiraleGenauigkeit')

// draws an array of points in geogebra
function drawPointArray(points, listName, visibility = false) {
	let cmd = listName + '={';
	points.forEach(p => cmd += `(${p.x},${p.y}),`);
	let tmp = cmd.split('');
	tmp.pop();
	cmd = tmp.join('');
	cmd += '}';
	ggbApplet.evalCommand(cmd);
	ggbApplet.setVisible(listName, visibility);
}

// 2D Vector class
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

function drawGitter() {
	let points = [];
	
	// Delete old gitter
	ggbApplet.evalCommand('Delete(gitter)');
	ggbApplet.evalCommand('Delete(giterStrecken)');

	// Draw points for the gitter
	const gitterBreite = nSpalte * spaltBreite + nSpalte * spaltAbstand + spaltAbstand;
	let height = gitterBreite / 2;

	for(let i = 0; i < nSpalte+1; ++i) {
		points.push({ x: 0, y: height });
		height -= spaltAbstand;
		points.push({ x: 0, y: height });
		height -= spaltBreite;
	}

	drawPointArray(points, 'gitter');

	let cmd = 'gitterStrecken={';
	// draw the lines between the points
	for(let i = 0; i < points.length; i+=2) {
		cmd += `Segment(gitter(${i+1}),gitter(${i+2})),`;
	}
	let tmp = cmd.split('');
	tmp.pop();
	cmd = tmp.join('');
	cmd+= '}';
	ggbApplet.evalCommand(cmd);
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
