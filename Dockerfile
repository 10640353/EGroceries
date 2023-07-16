# Use a Node.js base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the rest of the application code
ADD . .
RUN npm install express mssql ejs

# Expose the port your application listens on
EXPOSE 3000

# Run the Node.js application
CMD ["node", "server.js"]