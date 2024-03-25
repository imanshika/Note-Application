FROM node:alpine3.18
WORKDIR /usr/src/note_app
COPY package*.json .
RUN npm ci 
COPY . .
EXPOSE 8000
CMD ["npm", "start"]