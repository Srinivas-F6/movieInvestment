package com.movie.platform.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InvestorEarning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "investor_id")
    private User investor;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    private BigDecimal investedAmount;

    private BigDecimal interestEarned;

    private BigDecimal profitEarned;
    
    private BigDecimal lossAmount;
    
    private BigDecimal totalReceived;

    private LocalDateTime createdAt;

    
}