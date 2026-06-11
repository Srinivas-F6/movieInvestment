package com.movie.platform.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
public class MovieSettlementHistoryDTO {
	
	private Long movieId;
    private String movieTitle;

    private BigDecimal investedAmount;
    private BigDecimal interestEarned;
    private BigDecimal profitEarned;
    private BigDecimal lossAmount;
    private BigDecimal totalReceived;

    private LocalDateTime settlementDate;
}
