package com.training.accounting.invoice;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "invoices")
public class Invoice {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "business_id", nullable = false)
  private Long businessId;
  @Column(name = "customer_id", nullable = false)
  private Long customerId;
  @Column(name = "invoice_number", nullable = false)
  private String invoiceNumber;
  @Column(name = "invoice_date", nullable = false)
  private LocalDate invoiceDate;
  @Column(name = "due_date")
  private LocalDate dueDate;
  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal subtotal = BigDecimal.ZERO;
  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal discount = BigDecimal.ZERO;
  @Column(name = "gst_amount", nullable = false, precision = 14, scale = 2)
  private BigDecimal gstAmount = BigDecimal.ZERO;
  @Column(name = "total_amount", nullable = false, precision = 14, scale = 2)
  private BigDecimal totalAmount = BigDecimal.ZERO;
  @Column(name = "paid_amount", nullable = false, precision = 14, scale = 2)
  private BigDecimal paidAmount = BigDecimal.ZERO;
  @Column(nullable = false)
  private String status = "UNPAID";
  private String notes;
  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt = OffsetDateTime.now();
  @Column(name = "updated_at", nullable = false)
  private OffsetDateTime updatedAt = OffsetDateTime.now();

  @PreUpdate void touch(){ updatedAt = OffsetDateTime.now(); }

  public Long getId(){ return id; }
  public Long getBusinessId(){ return businessId; }
  public void setBusinessId(Long v){ businessId=v; }
  public Long getCustomerId(){ return customerId; }
  public void setCustomerId(Long v){ customerId=v; }
  public String getInvoiceNumber(){ return invoiceNumber; }
  public void setInvoiceNumber(String v){ invoiceNumber=v; }
  public LocalDate getInvoiceDate(){ return invoiceDate; }
  public void setInvoiceDate(LocalDate v){ invoiceDate=v; }
  public LocalDate getDueDate(){ return dueDate; }
  public void setDueDate(LocalDate v){ dueDate=v; }
  public BigDecimal getSubtotal(){ return subtotal; }
  public void setSubtotal(BigDecimal v){ subtotal=v; }
  public BigDecimal getDiscount(){ return discount; }
  public void setDiscount(BigDecimal v){ discount=v; }
  public BigDecimal getGstAmount(){ return gstAmount; }
  public void setGstAmount(BigDecimal v){ gstAmount=v; }
  public BigDecimal getTotalAmount(){ return totalAmount; }
  public void setTotalAmount(BigDecimal v){ totalAmount=v; }
  public BigDecimal getPaidAmount(){ return paidAmount; }
  public void setPaidAmount(BigDecimal v){ paidAmount=v; }
  public String getStatus(){ return status; }
  public void setStatus(String v){ status=v; }
  public String getNotes(){ return notes; }
  public void setNotes(String v){ notes=v; }
  public OffsetDateTime getCreatedAt(){ return createdAt; }
  public OffsetDateTime getUpdatedAt(){ return updatedAt; }
}
