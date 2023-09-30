/* eslint-disable */ 

const URL_DIRNAME_REGEXP = /^(.*)\//;
const FILE_TYPE_REGEXP = /.+\.([^\.]+)$/;
const URL_PARSER_REGEXP = /^(?:([^:\/?\#]+):)?(?:\/\/([^\/?\#]*))?([^?\#]*)(?:\?([^\#]*))?(?:\#(.*))?/;


function removeDotSegments(path) {
	var path = path.split('/');
	var isAbsolute = (path[0] === '');
	var result = [], fragment = '';
	if (isAbsolute) path.shift();
	while (path.length) {
		fragment = path.shift();
		if (fragment === '..') {
			result.pop();
		} else if (fragment !== '.') {
			result.push(fragment);
		}
	}
	if (isAbsolute) result.unshift('');
	if (fragment === '.' || fragment === '..') result.push('');
	return result.join('/');
}

function uri_parse(uri) {
	var result = uri.match(URL_PARSER_REGEXP);
	var scheme = (result[1] || '');
	var authority = (result[2] || '');
	var path = (result[3] || '');
	var fileName = (path.split('/').pop());
	var fileType = fileName.match(FILE_TYPE_REGEXP);
	fileType = (fileType && fileType[1] || '');
	return {
		scheme: scheme, authority: authority,
		path: path, fileName: fileName, fileType: fileType,
		query: (result[4] || ''), fragment: (result[5] || '')
	};
}

export const uri_resolve = (uri, base, urlArgs) => {
	var relUri = uri_parse(uri);
	var baseUri = uri_parse(base);
	var res = '', ts = '';
	if (relUri.scheme) {
		res += (relUri.scheme + ':');
		if (ts = relUri.authority) res += ('//' + ts);
		if (ts = removeDotSegments(relUri.path)) res += ts;
		if (ts = relUri.query) res += ('?' + ts);
	} else {
		if (ts = baseUri.scheme) res += (ts + ':');
		if (ts = relUri.authority) {
			res += ('//' + ts);
			if (ts = removeDotSegments(relUri.path || '')) res += ts;
			if (ts = relUri.query) res += ('?' + ts);
		} else {
			if (ts = baseUri.authority) res += ('//' + ts);
			if (ts = relUri.path) {
				if (ts = removeDotSegments(ts.charAt(0) === '/' ? ts : (
					baseUri.authority && !baseUri.path ? '/' :
					(baseUri.path.match(URL_DIRNAME_REGEXP) || [''])[0]
				) + ts)) res += ts;
				if (ts = relUri.query) res += ('?' + ts);
			} else {
				if (ts = baseUri.path) res += ts;
				if ((ts = relUri.query) ||
					(ts = baseUri.query)) res += ('?' + ts);
			}
		}
	}
	if (urlArgs) res += urlArgs;
	if (ts = relUri.fragment) res += ('#' + ts);
	return res;
};

export const cleanupUrl = (url) => {
	url = String(url);//.toLowerCase();
	url = url.replace(/\/+/g, '/');
	url = url.replace(/^\//, '');
	url = url.replace(/\/$/, '');
	url = '/' + url + '/';
	if (url === '//') url = '/';
	return url;
}
