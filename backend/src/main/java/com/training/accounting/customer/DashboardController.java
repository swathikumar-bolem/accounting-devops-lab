package com.training.accounting.customer;

import com.training.accounting.invoice.*;
import com.training.accounting.transaction.*;
import com.training.accounting.user.AppUser;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
  private final CustomerRepository customers;
  private final TransactionRepository transactions;
  private final InvoiceRepository invoices;

  public DashboardController(CustomerRepository customers, TransactionRepository transactions, InvoiceRepository invoices) {
    this.customers = customers;
    this.transactions = transactions;
    this.invoices = invoices;
  }

  @GetMapping
  public Map<String, Object> get(Authentication a) {
    Long b = ((AppUser) a.getDetails()).getBusinessId();
    LocalDate today = LocalDate.now();
    Map<String, Object> out = new LinkedHashMap<>();
    out.put("totalCustomers", customers.countByBusinessId(b));
    out.put("activeCustomers", customers.countByBusinessIdAndStatus(b, "ACTIVE"));
    out.put("totalInvoices", invoices.countByBusinessId(b));
    out.put("invoiceRevenue", nz(invoices.totalRevenue(b)));
    out.put("outstandingAmount", nz(invoices.totalOutstanding(b)));
    out.put("todaySales", nz(transactions.sumForDay(b, "SALE", today)));
    out.put("todayExpenses", nz(transactions.sumForDay(b, "EXPENSE", today)));
    out.put("recentTransactions", transactions.findTop8ByBusinessIdOrderByCreatedAtDesc(b));
    out.put("recentInvoices", invoices.findTop8ByBusinessIdOrderByCreatedAtDesc(b));
    out.put("status", "RUNNING");
    return out;
  }

  private BigDecimal nz(BigDecimal v) { return v == null ? BigDecimal.ZERO : v; }
}
