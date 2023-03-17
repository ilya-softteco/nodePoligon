FROM node:19-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node ./src/package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`

RUN npm ci



# Bundle app source
COPY --chown=node:node . .

# Run as node user so it doesn't run with root permissions
USER node

COPY ./src .

EXPOSE 8080
CMD [ "node", "index.js" ]