FROM node:lts-slim
WORKDIR /app
COPY . .
ENV NODE_ENV production
RUN npm install --prefix web-client --only=prod
RUN npm run deploy:client
RUN npm install --only=prod
EXPOSE 8000
CMD ["node", "server.js"]
