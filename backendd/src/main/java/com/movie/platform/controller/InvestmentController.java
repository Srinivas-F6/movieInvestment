package com.movie.platform.controller;

import com.movie.platform.dto.InvestorsResponse;
import com.movie.platform.model.Investment;
import com.movie.platform.model.InvestmentStage;
import com.movie.platform.model.Movie;
import com.movie.platform.service.InvestmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/investments")
@CrossOrigin(origins = "*")
public class InvestmentController {

    @Autowired
    private InvestmentService investmentService;

    // GET ALL INVESTMENTS OF A MOVIE
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<InvestorsResponse>> getInvestmentsByMovie(@PathVariable Long movieId) {

        return ResponseEntity.ok(
                investmentService.getInvestmentsByMovie(movieId)
        );
    }

    // GET USER INVESTMENTS
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Investment>> getInvestmentsForUser(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                investmentService.getInvestmentsByInvestor(userId)
        );
    }
    
   //create Stages
    @PreAuthorize("hasRole('PRODUCER')")
    @PostMapping("/{movieId}/stages")
    public ResponseEntity<InvestmentStage> createStage(
            @PathVariable Long movieId,
            @RequestParam BigDecimal amount,
            @RequestParam String stageName
    ) {

        InvestmentStage stage =
                investmentService.createStage(movieId, amount, stageName);

        return ResponseEntity.ok(stage);
    }
    
    
    
 // INVEST MONEY INTO STAGE
    @PreAuthorize("hasAnyRole('PRODUCER','USER')")
    @PostMapping("/stages/{stageId}/{movieId}/{userId}/invest")
    public ResponseEntity<InvestmentStage> investInStage( @PathVariable Long stageId, @PathVariable Long movieId,
    		 @PathVariable Long userId, @RequestParam Integer slotsToBuy ) {
        InvestmentStage updatedStage = investmentService.investInStage( stageId, movieId, slotsToBuy, userId );
        return ResponseEntity.ok(updatedStage);
    }
    
    
  // Get Investment stages by movieId
    @GetMapping("/{movieId}/stages")
    public ResponseEntity<List<InvestmentStage>> getInvestmentStages(
            @PathVariable Long movieId
    ) {

        List<InvestmentStage> stages =
                investmentService.getInvestmentStages(movieId);

        return ResponseEntity.ok(stages);
    }
    
  // Update Stage status
    @PreAuthorize("hasRole('ADMIN')")
     @PutMapping("/stages/{stageId}/status")
     public ResponseEntity<InvestmentStage> updateStageStatus(@PathVariable Long stageId, @RequestParam InvestmentStage.StageStatus status){
    	 return ResponseEntity.ok(
    			 investmentService.updateStageStatus(stageId, status));
     }
    
    // Delete stage from the movie
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/stages/{stageId}")
    public ResponseEntity<?> deleteStage(
            @PathVariable Long stageId
    ) {

        investmentService.deleteStage(stageId);
        HashMap<String, String> map = new HashMap<>();
        map.put("Message","Stage Deleted Successfully");

        return ResponseEntity.ok(map);
    }
    
    	
    
    
    
}