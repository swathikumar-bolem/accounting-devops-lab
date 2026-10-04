package com.training.accounting.invoice;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceItemRepository extends JpaRepository<InvoiceItem, Long> {
  List<InvoiceItem> findByInvoiceIdOrderById(Long invoiceId);
  void deleteByInvoiceId(Long invoiceId);
}
