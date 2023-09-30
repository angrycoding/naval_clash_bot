#!/bin/bash

cd ./server
npm run build

cd ../client
npm run build

cd ..

rm -rf ./dist
mkdir dist

cp -r ./server/dist/* ./dist
cp -r ./client/dist/* ./dist