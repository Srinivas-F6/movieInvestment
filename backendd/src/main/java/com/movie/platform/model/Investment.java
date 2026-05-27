package com.movie.platform.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "investments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // INVESTOR
    @JsonBackReference("user-investments")
    @ManyToOne
    @JoinColumn(name = "investor_id", nullable = false)
    private User investor;

    // MOVIE
    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    // NUMBER OF SLOTS PURCHASED
    @Column(	nullable = false)
    private Integer slotsToBuy;

    // TOTAL INVESTMENT AMOUNT
    @Column(nullable = false)
    private BigDecimal amount;

    // OPTIONAL:
    // stores slot price at investment time
    private BigDecimal slotPrice;

    private LocalDateTime investedAt;
    
    @ManyToOne
    @JoinColumn(name = "stage_id")
    private InvestmentStage stage;

    @PrePersist
    protected void onCreate() {
        investedAt = LocalDateTime.now();
    }
}