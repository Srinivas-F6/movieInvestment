package com.movie.platform.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvestorMovieSummaryDTO {

    private Long movieId;

    private String movieTitle;

    private BigDecimal totalInvested;

    private BigDecimal interestEarned;

    private BigDecimal profitEarned;

    private BigDecimal lossAmount;

    private BigDecimal totalReceived;

    private String status;
}