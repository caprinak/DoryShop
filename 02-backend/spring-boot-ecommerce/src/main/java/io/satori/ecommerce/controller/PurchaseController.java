package io.satori.ecommerce.controller;

import io.satori.ecommerce.dto.Purchase;
import io.satori.ecommerce.dto.PurchaseResponse;
import io.satori.ecommerce.service.CheckoutService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dory")
@CrossOrigin("http://localhost:4200")
public class PurchaseController {
    private CheckoutService checkoutService;

    public PurchaseController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/checkout")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
        PurchaseResponse purchaseResponse = checkoutService.takeOrder(purchase);
        return purchaseResponse;
    }

    @DeleteMapping("/checkout/{custId}")
    @ResponseBody
    public boolean deleteCustomer(@PathVariable Long custId) {
        boolean res = checkoutService.deleteCustomer(custId);
        return  res;
    }
}
