# Naval Clash Game - Telegram Mini App

Naval Clash a beloved childhood game for everyone.
Play now here: https://t.me/naval_clash_bot/play

![output](https://github.com/angrycoding/naval_clash_bot/assets/895042/c8cd0dce-69d9-4965-954b-fbfec04ed482)

Just in case if you have no idea what it is, then [here is some description](https://www.thesprucecrafts.com/the-basic-rules-of-battleship-411069)

## Project structure, running, building

Project is separated in two folders: **client** where all client stuff lives obviously and **server** for the server side. Client and server both written in TypeScript. Server side code is reusing
some parts of the client side code (i.e. shared code). Before starting developing, make sure that you check out the repo first:

```
git clone git@github.com:angrycoding/naval_clash_bot.git
```

### Starting the client

```
cd client
yarn
yarn start
```

Client side will start on port 3000, so now you should be able to open it in your web-browser (http://localhost:3000/)

### Building the client

In order to produce client's production build just run:

```
cd client
yarn
yarn build
```

Now just go to **client/dist** folder and see all build artefacts.

### Starting the server

Starting the server is also pretty simple:

```
cd server
yarn
yarn start
```

This will start watching **server/src** folder and will recompile / restart backend whenever some change is made. By default server will start on port 3495, but you can adjust it
if you change **socketIoPort** [here](https://github.com/angrycoding/naval_clash_bot/blob/main/client/src/Settings.ts).

### Building the server

Just go to **server** directory and run:

```
cd server
yarn
yarn build
```

This will compile all TypeScript files located in **server/src** and will produce one single bundle in **server/dist** (index.js) that you can run on your own dedicated server. This will also create
**server/dist/pm2.json** file that you can use in combination with [PM2 process manager](https://pm2.keymetrics.io/), but of course feel free to run it manually if you wish so.

### Building client and server altogether

There is pretty useful script that will let you to build client and server altogether at once, [check it out](https://github.com/angrycoding/naval_clash_bot/blob/main/build.sh):

```
./build.sh
```

(Make sure that you install all the dependencies first before running it)
This will run client build + server build and put everything into **dist** folder in the project root.

### Note about setting it up on real server

Usually when it comes to the point when you need to deploy such application on server then you have two friends: [NGINX](https://www.nginx.com/) and [PM2 process manager](https://pm2.keymetrics.io/)
First will handle all content serving, second will make sure that your server is running well and restart it in case if something goes wrong. That's why this project doesn't contain any [Express](https://expressjs.com/) server
or anything like that, also you won't find any SSL stuff here, cause usually in real life you would handle it separately and externally. Also that's exactly the reason why server side is not starting on some port like 80 or 443,
but instead uses some random port numbers. For my setup I just use combination of **NGINX** and **PM2** drop all stuff produced by **build.sh** into one folder on my server. But just in case if you're curious then my **nginx.conf** looks like this:

```
worker_processes auto;
user root;

events {
	worker_connections 8000;
	multi_accept on;
}

http {

	server_names_hash_bucket_size  64;
	include /etc/nginx/mime.types;

	server {
		ssl_certificate /etc/letsencrypt/fullchain.pem;
		ssl_certificate_key /etc/letsencrypt/privkey.pem;
		ssl_trusted_certificate /etc/letsencrypt/fullchain.pem;
		listen 443 ssl;

		# make sure that you use correct host name
		server_name naval_clash_bot.com;

		# directory where I drop all build
		root /root/naval_clash_bot;

		index index.html;
		error_page 404 https://naval_clash_bot.com/;

		# connect with api
		location /api/ {
			proxy_set_header X-Real-IP $remote_addr;
			# use port number that you run your backend part on
			proxy_pass http://127.0.0.1:3495;
		}

	}

}
```

But of course, if you find all this too complicated, then you can stil do it your own way.

## Client overview

From the client side perspective of view it's just [TypeScript](https://www.typescriptlang.org/) + [React](https://react.dev/) + [Socket.IO](https://socket.io/).
Project is based on standard [Create React App template](https://create-react-app.dev/docs/adding-typescript/) in it's TypeScript variation. In order to customize
standard Create React App setup without ["ejecting" it](https://create-react-app.dev/docs/available-scripts/) I use [react-app-rewired](https://github.com/timarney/react-app-rewired) and
[customize cra](https://github.com/arackaf/customize-cra). This allows me to hack into webpack configuration without loosing ability to update create react app template in the future (see
custom configuration [here](https://github.com/angrycoding/naval_clash_bot/blob/main/client/config-overrides.js)).
From the CSS perspective of view, project uses [Sass modules](https://sass-lang.com/documentation/modules/). So no rocket science here, just couple of well-known libraries along with React.

In order to make use **Telegram Mini App** platform features ([see full documentation here](https://core.telegram.org/bots/webapps)) there are few wrappers made (you can find them [here](https://github.com/angrycoding/naval_clash_bot/blob/main/client/src/utils/TelegramApi.ts)).

### Responsive design

One interesting thing that I'd like to mention here is **page responsiveness**. So we've got **Telegram Mini Apps platform** and by using it you can expect that your app will run on any device with basically any resolution. Usual solution here is to use so called "breakpoints". Here I decided to take a bit different approach: [CSS Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries). In simple words it introduces new CSS units:

- cqw: 1% of a query container's width
- cqh: 1% of a query container's height
- cqi: 1% of a query container's inline size
- cqb: 1% of a query container's block size
- cqmin: The smaller value of either cqi or cqb
- cqmax: The larger value of either cqi or cqb

And you can apply this units to anything, like element size, font size, border size and so on. So instead of changing page look discretely using traditional breakpoints, I use this new CSS units so interfaces kind of scales and adjusts to any resolution. Check this out:

https://github.com/angrycoding/naval_clash_bot/assets/895042/44312f95-f7f5-461f-9496-6aa40b6a6a79

## Server overview

Server side code is written using [TypeScript](https://www.typescriptlang.org/), in order to run it locally (**only locally**, never do it on production, because it's very inefficient performance wise), I use [nodemon](https://nodemon.io/) in combination with the TypeScript compliler itself it gives us very simple way to compile all typescript stuff automatically when you change something in your sources. Besides that most notable part for backend is [Socket.IO](https://socket.io/), but that's obvious since it's already mentioned that it's used on the front-end side. So again, no rocket science here, just get yourself familiar with it by running it locally. Also check [makeBundle.js](https://github.com/angrycoding/naval_clash_bot/blob/main/server/makeBundle.js) that is responsible for producing "production" bundle using [Browserify](https://browserify.org/).
