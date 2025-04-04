package io.satori.ecommerce.service;

import io.satori.ecommerce.dto.Purchase;
import io.satori.ecommerce.dto.PurchaseResponse;

import javax.transaction.Transactional;

public interface CheckoutService {
    @Transactional
    PurchaseResponse takeOrder(Purchase purchase
    );
    boolean deleteCustomer(Long customerId);
}
