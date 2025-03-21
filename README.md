## Prerequisites

Make sure you have the ff:

1. **Node.js**
2. **MongoDB**
3. **MongoDB Compass**

---

## Setting Up the Application

1. Set up the Database in MongoDB Compass
    - Open MongoDB Compass and connect to your MongoDB instance
    - Create a new database named "forumappdb" under the admin database
    - Inside the "forumappdb", create the following collections:
        - forums
        - posts
        - users
    - (Optional) Import sample data from the files
        - forums.json -> forums collection
        - posts.json → posts collection
        - users.json → users collection

2. Start the Application
    - Open command prompt
    - Navigate to the project directory
    - Run the following command: npm run test
        - This will start the server on localhost:3000

3. Access the application
    - Open your web browser and navigate to: http://localhost:3000
    