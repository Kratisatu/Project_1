const express = require('express');
const bodyParser = require('body-parser');

//Router import
const authRouter = require('./routes/auth_routes');

const app = express();
const PORT = 3000;

//Middleware
app.use(bodyParser.json());
app.use(authRouter);//Gives the server access to the POST /login and POST /user routes defined in authRoutes



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

