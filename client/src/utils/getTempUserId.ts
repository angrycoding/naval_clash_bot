import generateUniqueId from "./generateUniqueId";

const getTempUserId = (): string => {
	let result = localStorage.getItem('userid');
	if (result?.trim().length !== 64) {
		result = generateUniqueId(64);
		localStorage.setItem('userid', result)
	}
	return result;
}

export default getTempUserId;