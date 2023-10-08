import generateUniqueId from "./generateUniqueId";

const result = generateUniqueId(64);

const getTempUserId = (): string => {
	return result;
}

export default getTempUserId;