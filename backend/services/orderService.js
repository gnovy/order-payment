const uuid = require("uuid");

class OrderService {
    constructor() {
        this._AWS = require("aws-sdk");
        this._DocumentClient = new this._AWS.DynamoDB.DocumentClient();

        this._TableName = "orders";
    }

    async create(userId, unitPrice, quantity) {
        let results = await this._DocumentClient.put({
            TableName : this._TableName,
            Item: {
                orderId: uuid.v4(),
                userId: userId,
                unitPrice: unitPrice,
                quantity: quantity,
                createdTime: new Date().getTime(),
                status: "created"
            }
        }).promise();

        return results;
    }
}

module.exports = OrderService;