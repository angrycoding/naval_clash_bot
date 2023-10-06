const result: any = (navigator?.languages?.[0] || navigator.language);
const userLocale = (typeof result === 'string' ? result : 'en');

export default userLocale;