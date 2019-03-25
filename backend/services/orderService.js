const uuid = require("uuid");
const numberUtil = require("../util/numberUtil");
const config = require("../config");

class OrderService {
    constructor() {
        this._AWS = require("aws-sdk");
        this._DocumentClient = new this._AWS.DynamoDB.DocumentClient();
    }

    async create(userId, unitPrice, quantity) {
        let results = await this._DocumentClient.put({
            TableName : config.aws().tableNames.orderTable,
            Item: {
                orderId: uuid.v4(),
                userId: userId,
                unitPrice: unitPrice,
                quantity: quantity,
                createdTime: new Date().getTime(),
                authCode: numberUtil.generateRandomNumber(1, 5),
                status: "created"
            }
        }).promise();

        return results;
    }
}

module.exports = OrderService;