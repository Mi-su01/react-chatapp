FROM node:latest

WORKDIR /mya450-project

# Install create-react-app globally
RUN npm install -g create-react-app
RUN npm add express
RUN npm add body-parser 
RUN npm install mysql

EXPOSE 8080

# Run the app
CMD ["/bin/bash"]