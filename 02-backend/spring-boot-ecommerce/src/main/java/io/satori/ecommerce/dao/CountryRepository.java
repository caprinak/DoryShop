package io.satori.ecommerce.dao;

import io.satori.ecommerce.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "countries", path = "countries")
public interface CountryRepository extends JpaRepository<Country, Integer> {

//    Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable);
//
//    Page<Product> findByNameContaining(@RequestParam("name") String name, Pageable pageable);

}
