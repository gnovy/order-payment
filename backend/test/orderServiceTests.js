const expect = require("chai").expect;

const AWS = require("aws-sdk");
const AWSMock = require("aws-sdk-mock");

const OrderService = require("../services/orderService");

describe("OrderService", () => {
    it("should call DocumentClient.put when creating new order", async () => {
        AWSMock.mock("DynamoDB.DocumentClient", "put", function(params, callback){
            callback(null, "put had been called");
        });

        const orderService = new OrderService();

        let results = await orderService.create("222", 5, 10);

        expect(results).to.equals("put had been called");
    });
});