package com.training.accounting.customer;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "customers")
public class Customer {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "business_id", nullable = false)
  private Long businessId;

  @Column(nullable = false)
  private String name;

  @Column(name = "business_name")
  private String businessName;

  @Column(name = "business_type")
  private String businessType;

  private String email;
  private String phone;
  private String gstin;
  private String pan;

  @Column(columnDefinition = "TEXT")
  private String address;

  @Column(nullable = false)
  private String status = "ACTIVE";

  @Column(nullable = false)
  private String plan = "BASIC";

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt = OffsetDateTime.now();

  @Column(name = "updated_at", nullable = false)
  private OffsetDateTime updatedAt = OffsetDateTime.now();

  @PreUpdate
  void touch() { updatedAt = OffsetDateTime.now(); }

  public Long getId() { return id; }
  public Long getBusinessId() { return businessId; }
  public void setBusinessId(Long v) { businessId = v; }
  public String getName() { return name; }
  public void setName(String v) { name = v; }
  public String getBusinessName() { return businessName; }
  public void setBusinessName(String v) { businessName = v; }
  public String getBusinessType() { return businessType; }
  public void setBusinessType(String v) { businessType = v; }
  public String getEmail() { return email; }
  public void setEmail(String v) { email = v; }
  public String getPhone() { return phone; }
  public void setPhone(String v) { phone = v; }
  public String getGstin() { return gstin; }
  public void setGstin(String v) { gstin = v; }
  public String getPan() { return pan; }
  public void setPan(String v) { pan = v; }
  public String getAddress() { return address; }
  public void setAddress(String v) { address = v; }
  public String getStatus() { return status; }
  public void setStatus(String v) { status = v; }
  public String getPlan() { return plan; }
  public void setPlan(String v) { plan = v; }
  public OffsetDateTime getCreatedAt() { return createdAt; }
  public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
