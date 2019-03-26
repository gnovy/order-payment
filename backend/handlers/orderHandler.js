const PaymentService = require("../services/paymentService");
const OrderService = require("../services/orderService");
const OrderRepository = require("../repositories/orderRepository");

module.exports.create = async (event, context) => {
    const orderService = new OrderService(new OrderRepository(), new PaymentService());

    const results = await orderService.create(event.userId, event.unitPrice, event.quantity);

    return results;
};

module.exports.onOrderCreated = async (event, context) => {
    const orderService = new OrderService(new OrderRepository(), new PaymentService());

    if(event.Records){
        let promises = [];

        event.Records.forEach(record => {
            if(record.eventName === "INSERT"
                && record.dynamodb.NewImage.status.S === "created"){
                promises.push(orderService.onOrderCreated(record.dynamodb.NewImage.userId.S,
                    record.dynamodb.NewImage.orderId.S,
                    record.dynamodb.NewImage.authCode.N));
            }
        });

        await Promise.all(promises);
    }

    return;
};