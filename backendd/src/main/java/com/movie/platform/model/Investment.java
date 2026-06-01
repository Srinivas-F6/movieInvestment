package com.movie.platform.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;	

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

    @JsonBackReference("user-investments")
    @ManyToOne
    @JoinColumn(name = "investor_id", nullable = false)
    private User investor;

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer slotsToBuy;
    
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false)
    private BigDecimal amount;

    private LocalDateTime investedAt;
    
    @ManyToOne
    @JoinColumn(name = "stage_id")
    private InvestmentStage stage;	

    @PrePersist
    protected void onCreate() {
        investedAt = LocalDateTime.now();
    }
}