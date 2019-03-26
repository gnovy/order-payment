const expect = require("chai").expect;

const PaymentService = require("../services/paymentService");

describe("PaymentService", () => {
    let paymentService;

    beforeEach(() => {
        paymentService = new PaymentService();
    });

    it("should authorized payment when authCode is even", () => {
        expect(paymentService.isPaymentAuthorized("123", "345", 2)).to.be.equal(true);
    });

    it("should NOT authorized payment when authCode is odd", () => {
        expect(paymentService.isPaymentAuthorized("123", "345", 1)).to.be.equal(false);
    });
});