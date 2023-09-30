#!/bin/bash

cd ./server
yarn build

cd ../client
yarn build

cd ..

rm -rf ./dist
mkdir dist
mkdir dist/static

cp -r ./server/dist/* ./dist
cp -r ./client/dist/* ./dist/static