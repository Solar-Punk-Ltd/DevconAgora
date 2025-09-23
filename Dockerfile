FROM node as build

ARG BEE_API_URL
ARG BASE_URL
ARG HEALTH_CHECK_DATA_REF
ARG FEED_OWNER_ADDRESS
ARG ENV

WORKDIR /app

COPY package.json .
RUN npm i

RUN npm update

COPY . .

RUN echo "BEE_API_URL=$BEE_API_URL" >> .env && \
    echo "BASE_URL=$BASE_URL" >> .env && \
    echo "HEALTH_CHECK_DATA_REF=$HEALTH_CHECK_DATA_REF" >> .env && \
    echo "FEED_OWNER_ADDRESS=$FEED_OWNER_ADDRESS" >> .env && \
    echo "ENV=$ENV" >> .env && \
    chmod 644 .env

RUN npm run build

FROM nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
