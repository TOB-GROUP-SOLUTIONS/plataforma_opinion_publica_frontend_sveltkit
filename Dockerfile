FROM node:20
WORKDIR /app
COPY package*.json ./
COPY .env ./
RUN npm i
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["sh", "-c", "BODY_SIZE_LIMIT=Infinity PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host node build/index.js"]
