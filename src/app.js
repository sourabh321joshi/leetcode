const express = require('express');
const main = require('./config/db');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { authRouter } = require('./routes/auth.routes');
const { redisClient } = require('./config/redis');
const { adminRouter } = require('./routes/admin.routes');
const { adminMiddleware } = require('./middleware/admin.middleware');

app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send('Hello World');
});


app.use("/api/v1/auth" , authRouter)
app.use("/api/v1/admin" ,adminMiddleware, adminRouter)

const initializeConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("DB & Redis connected");

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};


initializeConnection();

// main().then(() => {
//     console.log('Connected to MongoDB');
//     app.listen(process.env.PORT, () => {
//         console.log(`Server is running on port ${process.env.PORT}`);
//       });

// })
// .catch((err) => {
//     console.log("Error connecting to MongoDB", err);
// });
