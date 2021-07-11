require('dotenv').config() //dot env req to be on top
const mongoose      = require('mongoose')
const express       = require('express')
const app           = express();

const bodyparser    = require('body-parser')
const cookieparser  = require("cookie-parser")
const cors          = require("cors")

//My Routes
const authRoutes    = require("./routes/auth")
const userRoutes    = require("./routes/user")
const CategoryRoutes    = require("./routes/category")

/* if you specify useNewUrlParser: true, you must specify a port in  connection string, 
like mongodb://localhost:27017/dbname. new url parser does not support connection strings that do not have a port, like mongodb://localhost/dbname.*/
mongoose.connect(process.env.DATABASE, {

    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true

}).then(()=> {
    console.log("DB CONNECTED");

}).catch(() => {
    console.log("DB CONNECTION FAILED");
})

//middlewares
app.use(bodyparser.json());
app.use(cookieparser())  // helps to create /put / delete some values into cookies
app.use(cors())


app.use("/api", authRoutes);
app.use("/api", userRoutes)
app.use("/api", CategoryRoutes)


const port =process.env.PORT || 8000;  //dotenv

app.listen(port, ()=> {
    console.log(`app is running at ${port}`);
})
