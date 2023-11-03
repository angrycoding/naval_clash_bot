import generateUniqueId from "../../../shared/generateUniqueId";

const persistentUserId = (() => {

	let result = (localStorage.getItem('persistentUserId') || '');
	if (typeof result !== 'string' || !result.trim()) {
		result = generateUniqueId(128);
		localStorage.setItem('persistentUserId', result);
	}

	return result;

})();


export default persistentUserId;