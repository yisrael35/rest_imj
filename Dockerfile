FROM node:14.16.0

ENV NODE_ENV=development 

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --development

COPY . .

CMD ["node", "./index.js"]