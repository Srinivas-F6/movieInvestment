package com.movie.platform.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvestorDashboardDTO {

    private BigDecimal totalInvested;

    private BigDecimal totalReceived;

    private BigDecimal totalProfit;

    private BigDecimal totalLoss;

    private List<InvestorMovieSummaryDTO> movies;
}