package com.movie.platform.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "investment_stages")
public class InvestmentStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Stage name required")
    @Enumerated(EnumType.STRING)
    private StageName stageName;

    @NotNull
    @DecimalMin(value = "1.0", message = "Stage amount must be positive")
    private BigDecimal stageAmount;

    private BigDecimal collectedAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    private StageStatus status = StageStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    @JsonBackReference
    private Movie movie;

    public enum StageName {
        PRE_PRODUCTION,
        PRODUCTION,
        POST_PRODUCTION,
        MARKETING_DISTRIBUTION
    }

    public enum StageStatus {
        PENDING,
        ACTIVE,
        HOLD,
        COMPLETED
    }	
}