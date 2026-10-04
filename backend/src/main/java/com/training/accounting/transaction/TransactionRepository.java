package com.training.accounting.transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface TransactionRepository extends JpaRepository<BusinessTransaction, Long> {
  List<BusinessTransaction> findByBusinessIdOrderByTxnDateDescIdDesc(Long businessId);
  List<BusinessTransaction> findByBusinessIdAndCustomerIdOrderByTxnDateDescIdDesc(Long businessId, Long customerId);
  Optional<BusinessTransaction> findByIdAndBusinessId(Long id, Long businessId);
  List<BusinessTransaction> findTop8ByBusinessIdOrderByCreatedAtDesc(Long businessId);

  @Query("select coalesce(sum(t.amount), 0) from BusinessTransaction t where t.businessId=:b and t.type=:type and t.txnDate=:d and t.status='POSTED'")
  BigDecimal sumForDay(@Param("b") Long businessId, @Param("type") String type, @Param("d") LocalDate date);
}
