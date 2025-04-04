package io.satori.ecommerce.dao;

import io.satori.ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long>
{
    Customer findByEmail(String theEmail);

//    default void save(Customer customer) {
//
//    }
}
