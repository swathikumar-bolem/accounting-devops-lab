package com.training.accounting.transaction;

import com.training.accounting.customer.CustomerRepository;
import com.training.accounting.user.AppUser;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
  private final TransactionRepository repo;
  private final CustomerRepository customers;

  public TransactionController(TransactionRepository repo, CustomerRepository customers) {
    this.repo = repo;
    this.customers = customers;
  }

  public record Req(
      Long customerId,
      @NotNull @Pattern(regexp = "SALE|PURCHASE|EXPENSE|PAYMENT|RECEIPT|JOURNAL") String type,
      @NotNull LocalDate txnDate,
      String referenceNo,
      @NotBlank String description,
      @NotNull @DecimalMin("0.00") BigDecimal amount,
      @Pattern(regexp = "POSTED|VOID") String status,
      String remarks) {}

  private Long bid(Authentication a) { return ((AppUser) a.getDetails()).getBusinessId(); }

  @GetMapping
  public List<BusinessTransaction> list(@RequestParam(required = false) Long customerId, Authentication a) {
    Long b = bid(a);
    return customerId == null
        ? repo.findByBusinessIdOrderByTxnDateDescIdDesc(b)
        : repo.findByBusinessIdAndCustomerIdOrderByTxnDateDescIdDesc(b, customerId);
  }

  @PostMapping
  public ResponseEntity<BusinessTransaction> create(@Valid @RequestBody Req q, Authentication a) {
    Long b = bid(a);
    validateCustomer(q.customerId(), b);
    BusinessTransaction t = new BusinessTransaction();
    t.setBusinessId(b);
    apply(t, q);
    return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(t));
  }

  @PutMapping("/{id}")
  public BusinessTransaction update(@PathVariable Long id, @Valid @RequestBody Req q, Authentication a) {
    Long b = bid(a);
    validateCustomer(q.customerId(), b);
    BusinessTransaction t = repo.findByIdAndBusinessId(id, b)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    apply(t, q);
    return repo.save(t);
  }

  @PostMapping("/{id}/void")
  public BusinessTransaction voidTransaction(@PathVariable Long id, Authentication a) {
    BusinessTransaction t = repo.findByIdAndBusinessId(id, bid(a))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    t.setStatus("VOID");
    return repo.save(t);
  }

  private void validateCustomer(Long customerId, Long businessId) {
    if (customerId != null && customers.findByIdAndBusinessId(customerId, businessId).isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer does not belong to this business");
    }
  }

  private void apply(BusinessTransaction t, Req q) {
    t.setCustomerId(q.customerId());
    t.setType(q.type());
    t.setTxnDate(q.txnDate());
    t.setReferenceNo(q.referenceNo());
    t.setDescription(q.description());
    t.setAmount(q.amount());
    t.setStatus(q.status() == null ? "POSTED" : q.status());
    t.setRemarks(q.remarks());
  }
}
