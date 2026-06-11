# base image for building the frontend
FROM node:18-alpine as build

# setting workdir
WORKDIR /app

#now copying package.json and package-lock.json to the workdir
COPY package*.json ./

#now installig dependencies
RUN npm install

#now copying the rest of the files to the workdir
COPY . .

#now building the frontend
RUN npm run build

# base image for running the frontend
FROM nginx:alpine 

# copying the built files from the build stage to the nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# exposing port 80 for nginx
EXPOSE 80

# starting nginx server
CMD ["nginx", "-g", "daemon off;"]