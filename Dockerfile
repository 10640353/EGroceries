# Use a Node.js base image
FROM node:12

# Set the working directory
WORKDIR /app ..

# Copy the rest of the application code
ADD . 
RUN npm install 

# Expose the port your application listens on
EXPOSE 4000

# Run the Node.js application
CMD ["node", "server.js"]
