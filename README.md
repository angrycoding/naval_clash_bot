# Naval Clash Game - Telegram Mini App

Naval Clash a beloved childhood game for everyone. Now available on Telegram!

![output](https://github.com/angrycoding/naval_clash_bot/assets/895042/c8cd0dce-69d9-4965-954b-fbfec04ed482)

## Client overview

From the client side perspective of view it's just [TypeScript](https://www.typescriptlang.org/) + [React](https://react.dev/) + [Socket.IO](https://socket.io/).
Project is based on standard [Create React App template](https://create-react-app.dev/docs/adding-typescript/) in it's TypeScript variation. In order to customize
standard Create React App setup without ["ejecting" it](https://create-react-app.dev/docs/available-scripts/) I use [react-app-rewired](https://github.com/timarney/react-app-rewired) and
[customize cra](https://github.com/arackaf/customize-cra). This allows me to hack into webpack configuration without loosing ability to update create react app template in the future.
From the CSS perspective of view, project uses [Sass modules](https://sass-lang.com/documentation/modules/). So no rocket science here, just couple of well-known libraries along with React.
