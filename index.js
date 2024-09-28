const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors'); // Add this for CORS
const bodyParser = require('body-parser');
const PORT = require("./config/server.config");
const { mongoDbUri } = require("./config/db.config");
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const ticketRoutes = require('./routes/ticket.routes');

const app = express();

// CORS Configuration - Replace with your frontend URL
app.use(cors({
    origin: 'https://your-netlify-frontend-url.com', // Replace with your actual Netlify URL
    credentials: true, // Allows sending cookies/headers
    methods: 'GET,HEAD,OPTIONS,POST,PUT,PATCH',
    allowedHeaders: 'Content-Type, x-access-token, Access-Control-Allow-Headers, Origin, Accept',
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
authRoutes(app);
userRoutes(app);
ticketRoutes(app);

// MongoDB connection
mongoose.connect(mongoDbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", () => {
    console.log("Error while connecting to database");
});

db.once("open", () => {
    console.log("Connected to MongoDB Successfully");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});


// app.listen(PORT, ()=>{
//     console.log("server is listening to the port: ", PORT);
//     /* connect to mongo db */
//     mongoose.connect(dbUri).then(
//         () => {
//             /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */
//             console.log("connected to mongo db successfully");
//         },
//         err => {
//             /** handle initial connection error */
//             console.log("Error occurred: ", err);
//         }
//     );
// })

