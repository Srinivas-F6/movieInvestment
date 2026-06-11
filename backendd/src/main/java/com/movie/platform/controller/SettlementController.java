package com.movie.platform.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.movie.platform.dto.InvestorDashboardDTO;
import com.movie.platform.dto.MovieSettlementHistoryDTO;
import com.movie.platform.dto.SettlementRequest;
import com.movie.platform.model.MovieSettlement;
import com.movie.platform.model.User;
import com.movie.platform.repository.UserRepository;
import com.movie.platform.service.SettlementService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/settlements")
public class SettlementController {

    private final SettlementService settlementService;
    private final UserRepository userRepository;

    @PostMapping("/{movieId}")
    public ResponseEntity<MovieSettlement> settleMovie(
            @PathVariable Long movieId,
            @RequestBody SettlementRequest request) {

        return ResponseEntity.ok(
                settlementService.settleMovie(
                        movieId,
                        request.getAmount()
                )
        );
    }
    
//    @GetMapping("/history")
//    public ResponseEntity<List<MovieSettlementHistoryDTO>>
//            getSettlementHistory(
//                    Authentication authentication) {
//
//        User user =
//                userRepository.findByEmail(
//                        authentication.getName())
//                        .orElseThrow();
//
//        return ResponseEntity.ok(
//                settlementService.getMovieSettlementHistory(
//                        user.getId()));
//    }
    
    
    
    @GetMapping("/userDashboard")
    public ResponseEntity<InvestorDashboardDTO>
            getDashboard(
                    Authentication authentication) {

        User user =
                userRepository.findByEmail(
                        authentication.getName())
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"));

        return ResponseEntity.ok(
                settlementService.getDashboard(
                        user.getId()));
    }
}
