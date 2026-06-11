package com.movie.platform.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "moviesettlement")
public class MovieSettlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Movie movie;

    private BigDecimal collectedAmount;

    private BigDecimal collectionPercentage;

    private BigDecimal profit;

    private BigDecimal loss;

    @Enumerated(EnumType.STRING)
    private SettlementType settlementType;

    private LocalDateTime settledAt;
    
    public enum SettlementType {
        SECURITY_RECOVERY,
        PRINCIPAL_INTEREST,
        PROFIT_SHARING
    }
}