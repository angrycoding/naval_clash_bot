function xy2index(xy: DOMPoint): number;
function xy2index(x: number, y: number): number;


function xy2index(x: any, y?: any): number {
	
	if (x instanceof DOMPoint) {
		y = x.y;
		x = x.x;
	}

	if (x < 0) return Infinity;
	if (y < 0) return Infinity;
	if (x > 9) return Infinity;
	if (y > 9) return Infinity;

	return y * 10 + x
}

export default xy2index;