package com.training.accounting.user; import jakarta.persistence.*;
@Entity @Table(name="businesses") public class Business { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false) private String name; public Long getId(){return id;} public String getName(){return name;} public void setName(String name){this.name=name;} }
