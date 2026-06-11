package com.movie.platform.dto;

import java.math.BigDecimal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SettlementRequest {
   private BigDecimal amount;

}
