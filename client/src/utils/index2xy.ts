const index2xy = (index: number, xOffset?: number, yOffset?: number): DOMPoint => {

	let x = index % 10;
    let y = Math.floor(index / 10);

	if (xOffset) {
		x += xOffset;
	}

	if (yOffset) {
		y += yOffset;
	}

	if (x < 0) x = Infinity;
	if (x > 9) x = Infinity;
	if (y < 0) y = Infinity;
	if (y > 9) y = Infinity;

	return new DOMPoint(x, y);

}

export default index2xy;