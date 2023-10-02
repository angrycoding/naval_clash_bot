import { CSSProperties } from "react";

const generateGrid = (lineSize: number, cellSize: number | string, color: string): CSSProperties => {

	const svg = `<svg xmlns="http://www.w3.org/2000/svg">
		<defs>
			<pattern id="grid" patternUnits="userSpaceOnUse" width="${cellSize}" height="${cellSize}">
				<rect x="0" y="0" width="${lineSize}" height="100%" fill="${color}" />
				<rect x="0" y="0" width="100%" height="${lineSize}" fill="${color}" />
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#grid)" />
	</svg>`;

	return {
		backgroundPosition: `-${lineSize / 2}px -${lineSize / 2}px`,
		backgroundImage: `url("data:image/svg+xml;,${encodeURIComponent(svg.replace(/\s+/g, ' '))}")`
	};

}

export default generateGrid;