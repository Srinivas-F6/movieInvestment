package com.movie.platform.service;

import com.movie.platform.dto.InvestorsResponse;
import com.movie.platform.model.*;
import com.movie.platform.repository.InvestmentRepository;
import com.movie.platform.repository.InvestmentStageRepository;
import com.movie.platform.repository.MovieRepository;
import com.movie.platform.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class InvestmentService {

    @Autowired
    private InvestmentRepository investmentRepository;
    
    @Autowired
    private InvestmentStageRepository investmentStageRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private UserRepository userRepository;
    

    // GET INVESTMENTS BY MOVIE
    public List<InvestorsResponse> getInvestmentsByMovie(Long movieId) {

        List<Investment> investments =
                investmentRepository.findByMovieId(movieId);

        return investments.stream()
                .map(investment -> new InvestorsResponse(
                        investment.getId(),
                        investment.getInvestor().getId(),
                        investment.getInvestor().getName(),
                        investment.getInvestor().getEmail(),
                        investment.getSlotsToBuy(),
                        investment.getAmount(),
                        investment.getStage()
                ))
                .toList();
    }

    // GET INVESTMENTS BY USER
    public List<Investment> getInvestmentsByInvestor(Long userId) {

        return investmentRepository.findByInvestorId(userId);
    }
    
 // CREATE NEW STAGE
    public InvestmentStage createStage(
            Long movieId,
            BigDecimal amount,
            String stageName
    ) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        InvestmentStage stage = new InvestmentStage();

        stage.setStageName(
                InvestmentStage.StageName.valueOf(stageName.toUpperCase())
        );

        stage.setStageAmount(amount);

        stage.setCollectedAmount(BigDecimal.ZERO);

        stage.setStatus(InvestmentStage.StageStatus.PENDING);

        stage.setMovie(movie);

        return investmentStageRepository.save(stage);
    }

    @Transactional
    public InvestmentStage investInStage(Long stageId,
                                         Long movieId,
                                         Integer slotsToBuy,
                                         Long userId) {

        InvestmentStage stage = investmentStageRepository.findById(stageId)
                .orElseThrow(() -> new RuntimeException("Stage not found"));
        
        if (stage.getStatus() != InvestmentStage.StageStatus.ACTIVE) {
            throw new RuntimeException(
                    "Investments are allowed only for ACTIVE stages"
            );
        }
        
        
        User investor = userRepository.findById(userId)
              .orElseThrow(() ->
                      new RuntimeException("User not found"));
        
        Movie movie = movieRepository.findById(movieId)
              .orElseThrow(() ->
                      new RuntimeException("Movie not found"));
        
        if (!stage.getMovie().getId().equals(movieId)) {
            throw new RuntimeException("Stage does not belong to this movie");
        }

        if (stage.getCollectedAmount() == null) {
            stage.setCollectedAmount(BigDecimal.ZERO);
        }
        
        BigDecimal amount = movie.getSlotPrice()
                .multiply(BigDecimal.valueOf(slotsToBuy));
        
        BigDecimal remaining = stage.getStageAmount()
                .subtract(stage.getCollectedAmount());

        if (amount.compareTo(remaining) > 0) {
            throw new RuntimeException("Investment exceeds required stage amount");
        }

        // --------------------------------
        // CREATE INVESTMENT ENTRY
        // --------------------------------

        Investment investment = new Investment();

        investment.setInvestor(investor);

        investment.setMovie(stage.getMovie());

        investment.setAmount(amount);
        
        movie.setCurrentFunding(movie.getCurrentFunding().add(amount));

        investment.setSlotsToBuy(slotsToBuy);

        investment.setStage(stage);

        investmentRepository.save(investment);

        // --------------------------------
        // UPDATE STAGE
        // --------------------------------

        BigDecimal updated = stage.getCollectedAmount().add(amount);

        stage.setCollectedAmount(updated);

        if (updated.compareTo(stage.getStageAmount()) == 0) {

            stage.setStatus(InvestmentStage.StageStatus.COMPLETED);

        } else {

            stage.setStatus(InvestmentStage.StageStatus.ACTIVE);
        }

        return investmentStageRepository.save(stage);
    }
    
     //GeT Investment Stages
    public List<InvestmentStage> getInvestmentStages(Long movieId){
        return investmentStageRepository.findByMovieId(movieId);
    }

	public InvestmentStage updateStageStatus(Long stageId, InvestmentStage.StageStatus status) {
		InvestmentStage stage = investmentStageRepository.findById(stageId)
				                .orElseThrow(()->
				                new RuntimeException("Movie not found"));
		stage.setStatus(status);
	    investmentStageRepository.save(stage);
		return stage;
				                	
	}
	
	
//	Delete Stage from the movie
	@Transactional
	public void deleteStage(Long stageId) {

	    InvestmentStage stage = investmentStageRepository
	            .findById(stageId)
	            .orElseThrow(() ->
	                    new RuntimeException("Stage not found"));
	    boolean hasInvestments =
	            investmentRepository.existsByStageId(stageId);

	    if (hasInvestments) {
	        throw new RuntimeException(
	                "Cannot delete stage because investments exist"
	        );
	    }
	    investmentStageRepository.delete(stage);
	}
	
    
    
    
}