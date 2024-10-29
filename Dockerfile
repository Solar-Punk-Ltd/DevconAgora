FROM node as build

ARG BEE_API_URL
ARG DEVCON6_SESSSIONS_HASH
ARG BASE_URL
ARG HEALTH_CHECK_DATA_REF
ARG FEED_OWNER_ADDRESS
ARG BACKEND_API_URL
ARG GATEWAY

WORKDIR /app

COPY package.json .
RUN npm i

RUN npm update

COPY . .

RUN echo "BEE_API_URL=$BEE_API_URL" >> .env && \
    echo "DEVCON6_SESSSIONS_HASH=$DEVCON6_SESSSIONS_HASH" >> .env && \
    echo "BASE_URL=$BASE_URL" >> .env && \
    echo "HEALTH_CHECK_DATA_REF=$HEALTH_CHECK_DATA_REF" >> .env && \
    echo "FEED_OWNER_ADDRESS=$FEED_OWNER_ADDRESS" >> .env && \
    echo "BACKEND_API_URL=$BACKEND_API_URL" >> .env && \
    echo "GATEWAY=$GATEWAY" >> .env && \
    chmod 644 .env

RUN npm run build

FROM nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
