#!/bin/bash
cp ./src/api.config.example ./src/api.config.js

sed -i "s/ENDPOINT_URL/http:\/\/localhost:3000/" ./src/api.config.js

npm install