FROM node:18.18-alpine

ENV CHROME_BIN="/usr/bin/chromium-browser"\
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium


RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

ENV PORT 4000

WORKDIR /usr/src/app

COPY package.json ./

COPY tsconfig.json ./

COPY yarn.lock ./

USER node

RUN yarn install

COPY --chown=node:node . .

RUN yarn build

EXPOSE 4000

CMD [ "yarn", "start" ]