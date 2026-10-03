package com.training.accounting.invoice;

import java.math.BigDecimal;
import java.util.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
  List<Invoice> findByBusinessIdOrderByInvoiceDateDescIdDesc(Long businessId);
  List<Invoice> findByBusinessIdAndCustomerIdOrderByInvoiceDateDescIdDesc(Long businessId, Long customerId);
  Optional<Invoice> findByIdAndBusinessId(Long id, Long businessId);
  List<Invoice> findTop8ByBusinessIdOrderByCreatedAtDesc(Long businessId);
  long countByBusinessId(Long businessId);

  @Query("select coalesce(sum(i.totalAmount), 0) from Invoice i where i.businessId=:b and i.status <> 'CANCELLED'")
  BigDecimal totalRevenue(@Param("b") Long businessId);

  @Query("select coalesce(sum(i.totalAmount - i.paidAmount), 0) from Invoice i where i.businessId=:b and i.status in ('UNPAID','PARTIALLY_PAID')")
  BigDecimal totalOutstanding(@Param("b") Long businessId);
}
