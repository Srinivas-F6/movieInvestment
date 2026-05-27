package com.movie.platform.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

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

    @Enumerated(EnumType.STRING)
    private StageName stageName;

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
        COMPLETED
    }
}