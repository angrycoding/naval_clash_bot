const audioContext = new AudioContext();

const CACHE: {[path: string]: AudioBuffer} = {};

const getSound = async(path: string): Promise<AudioBuffer | undefined> => {
	const cached = CACHE[path];
	if (cached) return cached;
	const response = await fetch(path);
	if (!response) return;
	const buffer = await response.arrayBuffer();
	if (!buffer) return;
	return (CACHE[path] = await audioContext.decodeAudioData(buffer));
}


const startPlaying = async(path: string) => {
	const audioBuffer = await getSound(path);
	if (!audioBuffer) return;
	const source = audioContext.createBufferSource();
	source.buffer = audioBuffer;
	source.loop = true;
	source.connect(audioContext.destination);
	source.start(0); 
}

const playSound = async(path: string) => {
	const audioBuffer = await getSound(path);
	if (!audioBuffer) return;
	const source = audioContext.createBufferSource();
	source.buffer = audioBuffer;
	source.connect(audioContext.destination);
	source.start(0); 
}

export {playSound, startPlaying};