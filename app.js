const userRoutes = require('./routes/userRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const paymentRoutes = require("./routes/paymentRoutes");
const premiumRoutes = require("./routes/premiumRoutes")
const forgotPasswordRoutes = require('./routes/forgotPasswordroutes')
const forgotPasswordModel = require("./models/forgotPasswordModel")
const express = require('express');
const path = require("path"); 

const Membership = require('./models/membershipModel');
const bodyParser = require('body-parser');

const User=require('./models/userModel')
const Expense=require('./models/expenseModel')

const sequelize = require('./util/database');
const cors = require('cors'); 
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(cors())
app.use(bodyParser.json())
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "signup.html"));
});
app.get("/homepage", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "homepage.html"));
})
app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "dashboard.html"));
})
app.use('/users', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/pay', paymentRoutes);
app.use('/premium', premiumRoutes)
app.use('/password', forgotPasswordRoutes )
User.hasMany(Expense);
Expense.belongsTo(User);

sequelize.sync()
.then(()=>{
    app.listen(3003);
})
.catch((err)=>{
    console.log(err);
})
