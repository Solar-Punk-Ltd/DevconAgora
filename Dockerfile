FROM node as build

ARG BEE_API_URL

ARG DEVCON6_SESSSIONS_HASH

ARG BASE_URL

ARG HEALTH_CHECK_DATA_REF

ARG FEED_OWNER_ADDRESS

ARG BACKEND_API_URL

WORKDIR /app

COPY package.json .
RUN npm i

COPY . .

RUN npm run build

FROM nginx

COPY --from=build /app/dist /usr/share/nginx/html

RUN $'BEE_API_URL $BEE_API_URL\n\
    DEVCON6_SESSSIONS_HASH $DEVCON6_SESSSIONS_HASH \n\
    baseurl         = https://example.com/packages/ \n\
    enabled         = 1 \n\
    gpgcheck        = 0' > /usr/share/nginx/html/.env