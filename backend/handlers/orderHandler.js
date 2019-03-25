const OrderService = require("../services/orderService");

module.exports.create = async (event, context, callback) => {
    const orderService = new OrderService();

    const results = await orderService.create(event.userId, event.unitPrice, event.quantity);

    return results;
};