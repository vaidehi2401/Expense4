const { createOrder, getPaymentStatus } = require("../services/cashfreeServices");
const authenticate = require("../middleware/auth");
const sequelize = require('../util/database');
const Membership = require('../models/membershipModel')
exports.getSessionId = async(req, res)=>{
     const orderId = Date.now().toString();
        const orderAmount = 1000;
        const orderCurrency="INR";
        const customerId=(req.user.dataValues.id).toString();
        const customerPhone ="0000000000"
       const sessionId = await createOrder(
        orderId,
        orderAmount,
        orderCurrency,
       customerId,
      customerPhone
        )
        
       res.status(200).json({paymentSessionId: sessionId});
}
exports.getPaymentStatus = async (req, res) => {
    try {
        const id = req.params.orderId;
        const customerId = req.params.customerId;
        console.log("This is iddddddd", customerId)
        const orderStatus = await getPaymentStatus(id); // Await if it's a promise

        // Ensure orderStatus is a string
        const statusText = typeof orderStatus === "string" ? orderStatus.toLowerCase() : "unknown";
        try{
            const membership1= await Membership.create({membershipStatus: orderStatus, userId: customerId});
       console.log(membership1)
        }
       catch(err){
        console.log(err);
       }
        res.send(`
            <html>
                <head>
                    <title>Payment Status</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f8f9fa;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            text-align: center;
                        }
                        .status-container {
                            background: white;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                            text-align: center;
                            max-width: 400px;
                            width: 100%;
                        }
                        h1 {
                            color: ${statusText === "success" ? "green" : "red"};
                        }
                        .btn {
                            display: inline-block;
                            padding: 12px 20px;
                            font-size: 16px;
                            font-weight: bold;
                            color: white;
                            background-color: #007bff;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            text-decoration: none;
                            transition: background-color 0.3s ease-in-out;
                            margin-top: 20px;
                        }
                        .btn:hover {
                            background-color: #0056b3;
                        }
                    </style>
                </head>
                <body>
                    <div class="status-container">
                        <h1>${orderStatus || "Unknown Status"}</h1>
                        <button class="btn" onclick="window.location.href='/homepage'">⬅ Back to Homepage</button>
                    </div>
                </body>
            </html>
        `);
    } catch (error) {
        console.error("Error fetching payment status:", error);
        res.status(500).send("Something went wrong. Please try again.");
    }
};
