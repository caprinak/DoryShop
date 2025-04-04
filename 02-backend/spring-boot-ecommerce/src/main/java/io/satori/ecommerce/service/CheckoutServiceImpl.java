package io.satori.ecommerce.service;

import io.satori.ecommerce.dao.CustomerRepository;
import io.satori.ecommerce.dto.Purchase;
import io.satori.ecommerce.dto.PurchaseResponse;
import io.satori.ecommerce.entity.Customer;
import io.satori.ecommerce.entity.Order;
import io.satori.ecommerce.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {


    private final CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional
    @Override
    public PurchaseResponse takeOrder(Purchase purchase) {
        //retrieve order info from dto
        Order order = purchase.getOrder();
        //generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);
        //populate order with orderitems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));
        //populate order with billing and shipping address
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());
        //populate customer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);


//save to the database
        customerRepository.save(customer);
//return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        //generate a random UUID number (UUID version-4)
        return UUID.randomUUID().toString();
    }

    @Override
    public boolean deleteCustomer(Long customerId) {
        System.out.println("Deleting Customer " + customerId);
        Optional<Customer> customerOptional = customerRepository.findById(customerId);
        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
            customerRepository.delete(customer);
            return true;
        } else {
            return false; // Order not found
        }
    }
}
