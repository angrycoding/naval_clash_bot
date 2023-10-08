export default (count: number, arr: string[]) => {
	const newCount = count % 100;
	if (newCount >= 11 && newCount <= 19) return [count, arr[2]].join(' ');
	const i = newCount % 10;
	if (i === 1) return [count, arr[0]].join(' ');
	if (i === 2 || i === 3 || i === 4) return [count, arr[1]].join(' ');
	return [count, arr[2]].join(' ');
}