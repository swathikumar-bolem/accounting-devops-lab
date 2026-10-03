package com.training.accounting.customer;

import com.training.accounting.user.AppUser;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
  private final CustomerRepository repo;

  public CustomerController(CustomerRepository repo) { this.repo = repo; }

  public record Req(
      @NotBlank String name,
      String businessName,
      String businessType,
      @Email String email,
      String phone,
      String gstin,
      String pan,
      String address,
      @Pattern(regexp = "ACTIVE|INACTIVE|TRIAL") String status,
      @Pattern(regexp = "BASIC|STANDARD|PREMIUM") String plan) {}

  private Long businessId(Authentication auth) {
    return ((AppUser) auth.getDetails()).getBusinessId();
  }

  @GetMapping
  public List<Customer> list(Authentication auth) {
    return repo.findByBusinessIdOrderByIdDesc(businessId(auth));
  }

  @GetMapping("/{id}")
  public Customer get(@PathVariable Long id, Authentication auth) {
    return repo.findByIdAndBusinessId(id, businessId(auth))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  @PostMapping
  public ResponseEntity<Customer> create(@Valid @RequestBody Req req, Authentication auth) {
    Customer c = new Customer();
    c.setBusinessId(businessId(auth));
    apply(c, req);
    return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(c));
  }

  @PutMapping("/{id}")
  public Customer update(@PathVariable Long id, @Valid @RequestBody Req req, Authentication auth) {
    Customer c = repo.findByIdAndBusinessId(id, businessId(auth))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    apply(c, req);
    return repo.save(c);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id, Authentication auth) {
    Customer c = repo.findByIdAndBusinessId(id, businessId(auth))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    c.setStatus("INACTIVE");
    repo.save(c);
  }

  private void apply(Customer c, Req q) {
    c.setName(q.name());
    c.setBusinessName(q.businessName());
    c.setBusinessType(q.businessType());
    c.setEmail(q.email());
    c.setPhone(q.phone());
    c.setGstin(q.gstin());
    c.setPan(q.pan());
    c.setAddress(q.address());
    c.setStatus(q.status() == null ? "ACTIVE" : q.status());
    c.setPlan(q.plan() == null ? "BASIC" : q.plan());
  }
}
