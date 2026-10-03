package com.training.accounting.invoice;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "invoice_items")
public class InvoiceItem {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "invoice_id", nullable = false)
  private Long invoiceId;
  @Column(nullable = false)
  private String description;
  @Column(nullable = false, precision = 12, scale = 2)
  private BigDecimal quantity;
  @Column(name = "unit_price", nullable = false, precision = 14, scale = 2)
  private BigDecimal unitPrice;
  @Column(name = "gst_rate", nullable = false, precision = 5, scale = 2)
  private BigDecimal gstRate = BigDecimal.ZERO;
  @Column(name = "line_total", nullable = false, precision = 14, scale = 2)
  private BigDecimal lineTotal = BigDecimal.ZERO;

  public Long getId(){ return id; }
  public Long getInvoiceId(){ return invoiceId; }
  public void setInvoiceId(Long v){ invoiceId=v; }
  public String getDescription(){ return description; }
  public void setDescription(String v){ description=v; }
  public BigDecimal getQuantity(){ return quantity; }
  public void setQuantity(BigDecimal v){ quantity=v; }
  public BigDecimal getUnitPrice(){ return unitPrice; }
  public void setUnitPrice(BigDecimal v){ unitPrice=v; }
  public BigDecimal getGstRate(){ return gstRate; }
  public void setGstRate(BigDecimal v){ gstRate=v; }
  public BigDecimal getLineTotal(){ return lineTotal; }
  public void setLineTotal(BigDecimal v){ lineTotal=v; }
}
