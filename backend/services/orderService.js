class OrderService {
    constructor(orderRepository, paymentService) {
        this._paymentService = paymentService;
        this._orderRepository = orderRepository;
    }

    async create(userId, unitPrice, quantity) {
        return await this._orderRepository.create(userId, unitPrice, quantity);
    }

    async onOrderCreated(userId, orderId, authCode) {
        let status = "cancelled";

        if(this._paymentService.isPaymentAuthorized(userId, orderId, authCode)){
            status = "confirmed";
        }

        return await this._orderRepository.updateStatus(userId, orderId, status);
    }
}

module.exports = OrderService;