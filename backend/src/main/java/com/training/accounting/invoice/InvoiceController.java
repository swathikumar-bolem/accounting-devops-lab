package com.training.accounting.invoice;

import com.training.accounting.customer.CustomerRepository;
import com.training.accounting.user.AppUser;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.*;
import java.time.LocalDate;
import java.util.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {
  private final InvoiceRepository invoices;
  private final InvoiceItemRepository items;
  private final CustomerRepository customers;

  public InvoiceController(InvoiceRepository invoices, InvoiceItemRepository items, CustomerRepository customers) {
    this.invoices = invoices;
    this.items = items;
    this.customers = customers;
  }

  public record ItemReq(
      @NotBlank String description,
      @NotNull @DecimalMin("0.01") BigDecimal quantity,
      @NotNull @DecimalMin("0.00") BigDecimal unitPrice,
      @NotNull @DecimalMin("0.00") BigDecimal gstRate) {}

  public record Req(
      @NotNull Long customerId,
      @NotBlank String invoiceNumber,
      @NotNull LocalDate invoiceDate,
      LocalDate dueDate,
      @DecimalMin("0.00") BigDecimal discount,
      @DecimalMin("0.00") BigDecimal paidAmount,
      String notes,
      @NotEmpty List<@Valid ItemReq> items) {}

  public record View(Invoice invoice, List<InvoiceItem> items) {}

  private Long bid(Authentication a) { return ((AppUser) a.getDetails()).getBusinessId(); }

  @GetMapping
  public List<View> list(@RequestParam(required = false) Long customerId, Authentication a) {
    Long b = bid(a);
    List<Invoice> list = customerId == null
        ? invoices.findByBusinessIdOrderByInvoiceDateDescIdDesc(b)
        : invoices.findByBusinessIdAndCustomerIdOrderByInvoiceDateDescIdDesc(b, customerId);
    return list.stream().map(this::view).toList();
  }

  @GetMapping("/{id}")
  public View get(@PathVariable Long id, Authentication a) {
    Invoice invoice = invoices.findByIdAndBusinessId(id, bid(a))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    return view(invoice);
  }

  @PostMapping
  @Transactional
  public ResponseEntity<View> create(@Valid @RequestBody Req req, Authentication a) {
    Long b = bid(a);
    validateCustomer(req.customerId(), b);
    Invoice invoice = new Invoice();
    invoice.setBusinessId(b);
    try {
      apply(invoice, req);
      invoice = invoices.saveAndFlush(invoice);
      saveItems(invoice, req.items());
      return ResponseEntity.status(HttpStatus.CREATED).body(view(invoice));
    } catch (DataIntegrityViolationException ex) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Invoice number already exists for this business");
    }
  }

  @PutMapping("/{id}")
  @Transactional
  public View update(@PathVariable Long id, @Valid @RequestBody Req req, Authentication a) {
    Long b = bid(a);
    validateCustomer(req.customerId(), b);
    Invoice invoice = invoices.findByIdAndBusinessId(id, b)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    try {
      apply(invoice, req);
      invoice = invoices.saveAndFlush(invoice);
      items.deleteByInvoiceId(invoice.getId());
      saveItems(invoice, req.items());
      return view(invoice);
    } catch (DataIntegrityViolationException ex) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Invoice number already exists for this business");
    }
  }

  @PostMapping("/{id}/cancel")
  public View cancel(@PathVariable Long id, Authentication a) {
    Invoice invoice = invoices.findByIdAndBusinessId(id, bid(a))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    invoice.setStatus("CANCELLED");
    return view(invoices.save(invoice));
  }

  private void validateCustomer(Long customerId, Long businessId) {
    if (customers.findByIdAndBusinessId(customerId, businessId).isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer does not belong to this business");
    }
  }

  private void apply(Invoice invoice, Req req) {
    BigDecimal subtotal = BigDecimal.ZERO;
    BigDecimal gst = BigDecimal.ZERO;
    for (ItemReq item : req.items()) {
      BigDecimal line = money(item.quantity().multiply(item.unitPrice()));
      BigDecimal lineGst = money(line.multiply(item.gstRate()).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP));
      subtotal = subtotal.add(line);
      gst = gst.add(lineGst);
    }

    BigDecimal discount = money(req.discount() == null ? BigDecimal.ZERO : req.discount());
    if (discount.compareTo(subtotal) > 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Discount cannot be greater than subtotal");
    }
    BigDecimal total = money(subtotal.subtract(discount).add(gst));
    BigDecimal paid = money(req.paidAmount() == null ? BigDecimal.ZERO : req.paidAmount());
    if (paid.compareTo(total) > 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Paid amount cannot be greater than invoice total");
    }

    invoice.setCustomerId(req.customerId());
    invoice.setInvoiceNumber(req.invoiceNumber());
    invoice.setInvoiceDate(req.invoiceDate());
    invoice.setDueDate(req.dueDate());
    invoice.setSubtotal(money(subtotal));
    invoice.setDiscount(discount);
    invoice.setGstAmount(money(gst));
    invoice.setTotalAmount(total);
    invoice.setPaidAmount(paid);
    invoice.setStatus(paid.signum() == 0 ? "UNPAID" : paid.compareTo(total) >= 0 ? "PAID" : "PARTIALLY_PAID");
    invoice.setNotes(req.notes());
  }

  private void saveItems(Invoice invoice, List<ItemReq> reqs) {
    for (ItemReq req : reqs) {
      InvoiceItem item = new InvoiceItem();
      item.setInvoiceId(invoice.getId());
      item.setDescription(req.description());
      item.setQuantity(req.quantity());
      item.setUnitPrice(money(req.unitPrice()));
      item.setGstRate(req.gstRate());
      item.setLineTotal(money(req.quantity().multiply(req.unitPrice())));
      items.save(item);
    }
  }

  private View view(Invoice invoice) {
    return new View(invoice, items.findByInvoiceIdOrderById(invoice.getId()));
  }

  private static BigDecimal money(BigDecimal v) {
    return v.setScale(2, RoundingMode.HALF_UP);
  }
}
