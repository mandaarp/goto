echo "prepare client ..."
npm install --only=prod --prefix web-app
echo "build client ..."
npm run build:prod --prefix web-app
echo "prepare server ..."
npm install --only=prod
