package com.training.accounting.customer;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
  List<Customer> findByBusinessIdOrderByIdDesc(Long businessId);
  Optional<Customer> findByIdAndBusinessId(Long id, Long businessId);
  long countByBusinessId(Long businessId);
  long countByBusinessIdAndStatus(Long businessId, String status);
}
