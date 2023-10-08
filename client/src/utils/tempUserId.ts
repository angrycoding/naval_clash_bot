import generateUniqueId from "./generateUniqueId";

let result = generateUniqueId(64);

export const getTempUserId = (): string => {
	return result;
}

export const refreshTempUserId = () => {
	result = generateUniqueId(64);
}