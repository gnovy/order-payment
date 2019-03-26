const uuid = require("uuid");
const numberUtil = require("../util/numberUtil");
const config = require("../config");
const AWS = require("aws-sdk");

class OrderRepository {
    constructor(db){
        if(db){
            this._db = db;
        }
        else{
            this._db = new AWS.DynamoDB.DocumentClient({
                region: config.aws().region
            });
        }
    }

    async create(userId, unitPrice, quantity){
        let results = await this._db.put({
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

    async updateStatus(userId, orderId, status){
        let results = await this._db.update({
            TableName: config.aws().tableNames.orderTable,
            Key: { userId: userId, orderId: orderId },
            UpdateExpression: "set #status = :status",
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: { ':status': status }
        }).promise();

        return results;
    }
}

module.exports = OrderRepository;