package com.training.accounting.transaction;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "transactions")
public class BusinessTransaction {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "business_id", nullable = false)
  private Long businessId;
  @Column(name = "customer_id")
  private Long customerId;
  @Column(nullable = false)
  private String type;
  @Column(name = "txn_date", nullable = false)
  private LocalDate txnDate;
  @Column(name = "reference_no")
  private String referenceNo;
  @Column(nullable = false)
  private String description;
  @Column(nullable = false, precision = 14, scale = 2)
  private BigDecimal amount;
  @Column(nullable = false)
  private String status = "POSTED";
  private String remarks;
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
  public String getType(){ return type; }
  public void setType(String v){ type=v; }
  public LocalDate getTxnDate(){ return txnDate; }
  public void setTxnDate(LocalDate v){ txnDate=v; }
  public String getReferenceNo(){ return referenceNo; }
  public void setReferenceNo(String v){ referenceNo=v; }
  public String getDescription(){ return description; }
  public void setDescription(String v){ description=v; }
  public BigDecimal getAmount(){ return amount; }
  public void setAmount(BigDecimal v){ amount=v; }
  public String getStatus(){ return status; }
  public void setStatus(String v){ status=v; }
  public String getRemarks(){ return remarks; }
  public void setRemarks(String v){ remarks=v; }
  public OffsetDateTime getCreatedAt(){ return createdAt; }
  public OffsetDateTime getUpdatedAt(){ return updatedAt; }
}
