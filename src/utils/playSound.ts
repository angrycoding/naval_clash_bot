const audioContext = new AudioContext();


const getSound = async(path: string): Promise<AudioBuffer | undefined> => {
	const response = await fetch(path);
	if (!response) return;
	const buffer = await response.arrayBuffer();
	if (!buffer) return;
	return await audioContext.decodeAudioData(buffer);
}


const playSound = async(path: string) => {

	const audioBuffer = await getSound(path);
	if (!audioBuffer) return;

	const source = audioContext.createBufferSource();
	source.buffer = audioBuffer;
	source.connect(audioContext.destination);
	source.start(0); 
}

export default playSound;