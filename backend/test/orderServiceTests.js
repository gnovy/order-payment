const expect = require("chai").expect;

const OrderService = require("../services/orderService");
const OrderRepository = require("../repositories/orderRepository");

const PaymentService = require("../services/paymentService");

const sinon = require("sinon");

describe("OrderService", () => {
    let orderRepository, orderService, paymentService;

    beforeEach(() => {
        orderRepository = new OrderRepository({put: () => {return {promise: () => {}}}, update:() =>{return {promise: () => {}}}});
        paymentService = new PaymentService();
        orderService = new OrderService(orderRepository, paymentService);
    });

    it("should call OrderRepository.create when creating new order", async() => {
        sinon.spy(orderRepository, "create");

        await orderService.create("123", 5, 10);

        expect(orderRepository.create.calledOnce).to.be.true;
        expect(orderRepository.create.firstCall.args[0]).to.be.equal("123");
        expect(orderRepository.create.firstCall.args[1]).to.be.equal(5);
        expect(orderRepository.create.firstCall.args[2]).to.be.equal(10);
    });

    it("should call OrderRepository.updateStatus with confirmed status when an order is created with successful authCode", async() => {
        sinon.spy(orderRepository, "updateStatus");
        sinon.stub(paymentService, "isPaymentAuthorized").returns(true);

        await orderService.onOrderCreated("123", "456", 5);

        expect(orderRepository.updateStatus.calledOnce).to.be.true;
        expect(orderRepository.updateStatus.firstCall.args[0]).to.be.equal("123");
        expect(orderRepository.updateStatus.firstCall.args[1]).to.be.equal("456");
        expect(orderRepository.updateStatus.firstCall.args[2]).to.be.equal("confirmed");
    });

    it("should call OrderRepository.updateStatus with cancelled status when an order is created with failed authCode", async() => {
        sinon.spy(orderRepository, "updateStatus");
        sinon.stub(paymentService, "isPaymentAuthorized").returns(false);

        await orderService.onOrderCreated("123", "456", 5);

        expect(orderRepository.updateStatus.calledOnce).to.be.true;
        expect(orderRepository.updateStatus.firstCall.args[0]).to.be.equal("123");
        expect(orderRepository.updateStatus.firstCall.args[1]).to.be.equal("456");
        expect(orderRepository.updateStatus.firstCall.args[2]).to.be.equal("cancelled");
    });

    afterEach(() => {
        sinon.restore();
    });
});
