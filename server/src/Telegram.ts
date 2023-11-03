// import FS from 'fs';
// import Path from 'path';
import Request from 'request';
import Settings from "../../shared/Settings";
import formatText from './formatText';

type ObjectLiteral = {[key: string]: any};

const performRequest = (method: string, payload?: ObjectLiteral) => new Promise<ObjectLiteral>(resolve => {
	Request.post({
		uri: `${Settings.telegramBotApiUrl}/bot${Settings.telegramBotToken}/${method}`,
		timeout: Settings.telegramBotRequestTimeoutMs,
		json: payload
	}, (_error, _response, body) => {
		if (typeof body === 'string') {
			try { body = JSON.parse(body); }
			catch (e) {}
		}
		resolve(body instanceof Object ? body : {});
	});
});

const getWebhookUrl = async(): Promise<string> => {
	const body = await performRequest('getWebhookInfo');
	const result = (body.ok === true ? body?.result?.url : '');
	return (typeof result === 'string' ? result : '');
};

const setWebhookUrl = async(url: string): Promise<boolean> => {
	const body = await performRequest('setWebhook', { url });
	return (body.ok === true);
};

export const deleteWebhookUrl = async(): Promise<boolean> => {
	const body = await performRequest('deleteWebhook');
	return (body.ok === true);
};

export const updateWebhookUrl = async(url: string): Promise<boolean> => {
	console.info('delete', await deleteWebhookUrl());
	console.info('set', await setWebhookUrl(url));
	return (await getWebhookUrl() === url);
}

export const sendMessage = async(text: string, chat_id: number, extraFields?: ObjectLiteral): Promise<boolean> => {
	const body = await performRequest('sendMessage', {
		text: formatText(text),
		parse_mode: 'HTML',
		chat_id,
		...(extraFields || {})
	});
	return (body?.ok === true);
}

export const answerCallbackQuery = (callback_query_id: string) => {
	performRequest('answerCallbackQuery', { callback_query_id });
}