package com.movie.platform.dto;

import java.math.BigDecimal;

import com.movie.platform.model.InvestmentStage;



public record InvestorsResponse(
        Long investmentId,
        Long investorId,
        String investorName,
        String investorEmail,
        Integer slotsToBuy,
        BigDecimal amount,
        InvestmentStage stage
) {}
