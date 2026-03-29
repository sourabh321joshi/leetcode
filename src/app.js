const express = require('express');
const main = require('./config/db');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { authRouter } = require('./routes/auth.routes');

app.use(express.json());
app.use(cookieParser());



app.get('/', (req, res) => {
    res.send('Hello World');
});


app.use("/api/v1" , authRouter)

main().then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
      });

})
.catch((err) => {
    console.log("Error connecting to MongoDB", err);
});
