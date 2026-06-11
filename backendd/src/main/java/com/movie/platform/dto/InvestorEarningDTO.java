package com.movie.platform.dto;

import java.math.BigDecimal;

public record InvestorEarningDTO(

        Long movieId,

        String movieTitle,

        BigDecimal investedAmount,

        BigDecimal interestEarned,

        BigDecimal profitEarned,

        BigDecimal totalReceived

) {}