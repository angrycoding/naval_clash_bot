# Naval Clash Game - Telegram Mini App

Naval Clash a beloved childhood game for everyone. Now available on Telegram!

![output](https://github.com/angrycoding/naval_clash_bot/assets/895042/c8cd0dce-69d9-4965-954b-fbfec04ed482)

## Project structure, running it locally

Project is separated in two folders: **client** where all client stuff lives obviously and **server** for the server side. Client and server both written in TypeScript. Server side code is reusing
some parts of the client side code (i.e. shared code). Before starting developing, make sure that you check out the repo first:

```
git clone git@github.com:angrycoding/naval_clash_bot.git
```

**Starting the client:**

```
cd client
yarn start
```

Client side will start on port 3000, so now you should be able to open it in your web-browser (http://localhost:3000/)

**Building the client:**

In order to produce client's production build just run:

```
cd client
yarn build
```

Now just go to **dist** folder and see all build artefacts.

**Starting the server:**

Starting the server is also pretty simple:

```
cd server
yarn start
```

This will start watching **server/src** folder and will recompile / restart backend whenever some change is made. By default server will start on port 3495, but you can adjust it
if you change **socketIoPort** [here](https://github.com/angrycoding/naval_clash_bot/blob/main/client/src/Settings.ts).


## Client overview

From the client side perspective of view it's just [TypeScript](https://www.typescriptlang.org/) + [React](https://react.dev/) + [Socket.IO](https://socket.io/).
Project is based on standard [Create React App template](https://create-react-app.dev/docs/adding-typescript/) in it's TypeScript variation. In order to customize
standard Create React App setup without ["ejecting" it](https://create-react-app.dev/docs/available-scripts/) I use [react-app-rewired](https://github.com/timarney/react-app-rewired) and
[customize cra](https://github.com/arackaf/customize-cra). This allows me to hack into webpack configuration without loosing ability to update create react app template in the future.
From the CSS perspective of view, project uses [Sass modules](https://sass-lang.com/documentation/modules/). So no rocket science here, just couple of well-known libraries along with React.

In order to make use **Telegram Mini App** platform features there are few wrappers made (you can find them [here](https://github.com/angrycoding/naval_clash_bot/blob/main/client/src/utils/TelegramApi.ts)).
