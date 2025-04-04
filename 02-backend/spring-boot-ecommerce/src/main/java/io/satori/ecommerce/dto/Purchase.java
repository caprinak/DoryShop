package io.satori.ecommerce.dto;

import io.satori.ecommerce.entity.Address;
import io.satori.ecommerce.entity.Customer;
import io.satori.ecommerce.entity.Order;
import io.satori.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
