const {Cashfree} = require("cashfree-pg");
Cashfree.XClientId = "TEST430329ae80e0f32e41a393d78b923034";
Cashfree.XClientSecret = "TESTaf195616268bd6202eeb3bf8dc458956e7192a85";
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
exports.createOrder =async(
orderId,
orderAmount,
orderCurrency="IND",
customerId,
customerPhone
)=>{
    try{
const expiryDate = new Date(Date.now() + 60*60*1000);
const formattedDate = expiryDate.toISOString();
const request ={
    order_amount:orderAmount,
    order_currency:orderCurrency,
    order_id :orderId,
    customer_details:{
    customer_id:customerId,
    customer_phone: customerPhone
    },

    order_meta: {
        "return_url": `http://localhost:3003/pay/payment-status/${orderId}/${customerId}`,
        "payment_methods": "cc,nb,upi"
    },
    order_expiry_time: formattedDate
};
const reponse = await Cashfree.PGCreateOrder("2023-08-01", request);
return reponse.data.payment_session_id;
    }
    catch(err){
console.log("Error creating order", err);
    }

}
exports.getPaymentStatus=async(orderId)=>{
    try{
    const response = await Cashfree.PGOrderFetchPayments("2023-08-01",orderId);
    let getOrderResponse = response.data;
    let orderStatus;
    if(getOrderResponse.filter(transaction => transaction.payment_status === "SUCCESS").length > 0){
        orderStatus = "Success"
    }else if(getOrderResponse.filter(transaction => transaction.payment_status === "PENDING").length > 0){
        orderStatus = "Pending"
    }else{
        orderStatus = "Failure"
    }
    return orderStatus;
}
catch(err){
    console.log("Error", err);
    return err;
}
}
