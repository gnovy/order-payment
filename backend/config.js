module.exports.aws = () => {
    return {
        region: "us-east-1",
        tableNames: {
            orderTable: "orders"
        }
    }
};