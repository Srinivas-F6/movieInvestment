package com.movie.platform.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.movie.platform.dto.InvestorDashboardDTO;
import com.movie.platform.dto.InvestorMovieSummaryDTO;
import com.movie.platform.dto.MovieSettlementHistoryDTO;
import com.movie.platform.model.Investment;
import com.movie.platform.model.InvestmentStage.StageName;
import com.movie.platform.model.InvestorEarning;
import com.movie.platform.model.Movie;
import com.movie.platform.model.MovieSettlement;
import com.movie.platform.model.MovieSettlement.SettlementType;
import com.movie.platform.model.User;
import com.movie.platform.repository.InvestmentRepository;
import com.movie.platform.repository.InvestorEarningRepository;
import com.movie.platform.repository.MoiveSettlementRepository;
import com.movie.platform.repository.MovieRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SettlementService {
	
	
    private final MovieRepository movieRepository;
    private final MoiveSettlementRepository settlementRepository;
    private final InvestmentRepository investmentRepository;
    private final InvestorEarningRepository earningRepository;

    public MovieSettlement settleMovie(
            Long movieId,
            BigDecimal collectedAmount) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow();

        BigDecimal budget = movie.getCurrentFunding();

        BigDecimal percentage =
                collectedAmount.multiply(BigDecimal.valueOf(100))
                        .divide(budget, 2, RoundingMode.HALF_UP);

        BigDecimal profit = BigDecimal.ZERO;
        BigDecimal loss = BigDecimal.ZERO;

        SettlementType settlementType;

        if (percentage.compareTo(BigDecimal.valueOf(25)) < 0) {

            settlementType = SettlementType.SECURITY_RECOVERY;

            loss = budget.subtract(collectedAmount);

        } else if (percentage.compareTo(BigDecimal.valueOf(100)) <= 0) {

            settlementType = SettlementType.PRINCIPAL_INTEREST;

            loss = budget.subtract(collectedAmount);

        } else {

            settlementType = SettlementType.PROFIT_SHARING;

            profit = collectedAmount.subtract(budget);
        }

        MovieSettlement settlement = new MovieSettlement();

        settlement.setMovie(movie);
        settlement.setCollectedAmount(collectedAmount);
        settlement.setCollectionPercentage(percentage);
        settlement.setProfit(profit);
        settlement.setLoss(loss);
        settlement.setSettlementType(settlementType);
        settlement.setSettledAt(LocalDateTime.now());

        MovieSettlement saved =  settlementRepository.save(settlement);
       
        allocateEarnings(movie, saved);
        return saved;
    }
    
    
    
    private void allocateEarnings(
            Movie movie,
            MovieSettlement settlement) {
    	
        switch (settlement.getSettlementType()) {

            case SECURITY_RECOVERY ->
                    allocateSecurityRecovery(movie,settlement);

            case PRINCIPAL_INTEREST ->
                    allocatePrincipalInterest(movie,settlement);

            case PROFIT_SHARING ->
                    allocateProfitSharing(movie, settlement);
        }
    }
    
    
    private void allocateSecurityRecovery(
            Movie movie,
            MovieSettlement settlement) {

        List<Investment> investments =
                investmentRepository.findByMovieId(
                        movie.getId());

        BigDecimal totalInvestment =
                investments.stream()
                        .map(Investment::getAmount)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add);
        
        BigDecimal producerLoss =
                totalInvestment.multiply(
                        BigDecimal.valueOf(0.75));

        movie.setProfit(BigDecimal.ZERO);
        movie.setLoss(producerLoss);
        movieRepository.save(movie);

        Map<Long, User> investorMap =
                new HashMap<>();

        Map<Long, BigDecimal> investedMap =
                new HashMap<>();

        Map<Long, BigDecimal> lossMap =
                new HashMap<>();

        Map<Long, BigDecimal> receivedMap =
                new HashMap<>();

        for (Investment investment : investments) {

            BigDecimal ratio =
                    investment.getAmount()
                            .divide(
                                    totalInvestment,
                                    8,
                                    RoundingMode.HALF_UP);

            BigDecimal collectionShare =
                    settlement.getCollectedAmount()
                            .multiply(ratio);

            BigDecimal guaranteeAmount =
                    investment.getAmount()
                            .multiply(
                                    BigDecimal.valueOf(0.75));

            BigDecimal recovered =
                    guaranteeAmount.add(
                            collectionShare);

            BigDecimal loss =
                    investment.getAmount()
                            .subtract(recovered);

            Long investorId =
                    investment.getInvestor().getId();

            investorMap.put(
                    investorId,
                    investment.getInvestor());

            investedMap.merge(
                    investorId,
                    investment.getAmount(),
                    BigDecimal::add);

            lossMap.merge(
                    investorId,
                    loss,
                    BigDecimal::add);

            receivedMap.merge(
                    investorId,
                    recovered,
                    BigDecimal::add);
        }

        for (Long investorId : investorMap.keySet()) {

            InvestorEarning earning =
                    new InvestorEarning();

            earning.setInvestor(
                    investorMap.get(investorId));

            earning.setMovie(movie);

            earning.setInvestedAmount(
                    investedMap.getOrDefault(
                            investorId,
                            BigDecimal.ZERO));

            earning.setInterestEarned(
                    BigDecimal.ZERO);

            earning.setProfitEarned(
                    BigDecimal.ZERO);

            earning.setLossAmount(
                    lossMap.getOrDefault(
                            investorId,
                            BigDecimal.ZERO));

            earning.setTotalReceived(
                    receivedMap.getOrDefault(
                            investorId,
                            BigDecimal.ZERO));

            earning.setCreatedAt(
                    LocalDateTime.now());

            earningRepository.save(earning);
        }
    }
    
    
    private void allocatePrincipalInterest(
            Movie movie,
            MovieSettlement settlement) {

        List<Investment> investments =
                investmentRepository.findByMovieId(
                        movie.getId());
        
        BigDecimal totalInvestment =
                investments.stream()
                        .map(Investment::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal producerLoss =
                totalInvestment.subtract(
                        settlement.getCollectedAmount());

        movie.setProfit(BigDecimal.ZERO);
        movie.setLoss(producerLoss.max(BigDecimal.ZERO));

        movieRepository.save(movie);

        Map<Long, User> investorMap =
                new HashMap<>();

        Map<Long, BigDecimal> investedMap =
                new HashMap<>();

        Map<Long, BigDecimal> interestMap =
                new HashMap<>();

        Map<Long, BigDecimal> receivedMap =
                new HashMap<>();

        for (Investment investment : investments) {

            long days =
                    ChronoUnit.DAYS.between(
                            investment.getInvestedAt().toLocalDate(),
                            settlement.getSettledAt().toLocalDate()) + 1;

            BigDecimal interest =
                    investment.getAmount()
                            .multiply(new BigDecimal("0.12"))
                            .multiply(BigDecimal.valueOf(days))
                            .divide(
                                    BigDecimal.valueOf(365),
                                    2,
                                    RoundingMode.HALF_UP);

            Long investorId =
                    investment.getInvestor().getId();

            investorMap.put(
                    investorId,
                    investment.getInvestor());

            investedMap.merge(
                    investorId,
                    investment.getAmount(),
                    BigDecimal::add);

            interestMap.merge(
                    investorId,
                    interest,
                    BigDecimal::add);

            receivedMap.merge(
                    investorId,
                    investment.getAmount()
                            .add(interest),
                    BigDecimal::add);
        }

        for (Long investorId : investorMap.keySet()) {

            InvestorEarning earning =
                    new InvestorEarning();

            BigDecimal totalInvested =
                    investedMap.getOrDefault(
                            investorId,
                            BigDecimal.ZERO);

            BigDecimal totalInterest =
                    interestMap.getOrDefault(
                            investorId,
                            BigDecimal.ZERO);

            BigDecimal totalReceived =
                    receivedMap.getOrDefault(
                            investorId,
                            BigDecimal.ZERO);

            earning.setInvestor(
                    investorMap.get(investorId));

            earning.setMovie(movie);

            earning.setInvestedAmount(
                    totalInvested);

            earning.setInterestEarned(
                    totalInterest);

            earning.setProfitEarned(
                    BigDecimal.ZERO);

            earning.setLossAmount(
                    BigDecimal.ZERO);

            earning.setTotalReceived(
                    totalReceived);

            earning.setCreatedAt(
                    LocalDateTime.now());

            earningRepository.save(earning);
        }
    }
    
    
    private BigDecimal getStagePercentage(
            StageName stageName) {

        return switch (stageName) {

            case PRE_PRODUCTION ->
                    BigDecimal.valueOf(0.40);

            case PRODUCTION ->
                    BigDecimal.valueOf(0.30);

            case POST_PRODUCTION ->
                    BigDecimal.valueOf(0.20);

            case MARKETING_DISTRIBUTION ->
                    BigDecimal.valueOf(0.10);

            default ->
                    BigDecimal.ZERO;
        };
    }
    
    
    private void allocateProfitSharing(
            Movie movie,
            MovieSettlement settlement) {

        List<Investment> investments =
                investmentRepository.findByMovieId(
                        movie.getId());

        BigDecimal investorProfitPool =
                settlement.getProfit()	
                        .multiply(BigDecimal.valueOf(0.50));
        
        BigDecimal producerProfit =
                settlement.getProfit()
                        .multiply(BigDecimal.valueOf(0.50));
        
        movie.setProfit(producerProfit);
        movie.setLoss(BigDecimal.ZERO);

        List<StageName> stages = List.of(
                StageName.PRE_PRODUCTION,
                StageName.PRODUCTION,
                StageName.POST_PRODUCTION,
                StageName.MARKETING_DISTRIBUTION
        );

        Map<Long, User> investorMap = new HashMap<>();

        Map<Long, BigDecimal> investedMap = new HashMap<>();
        Map<Long, BigDecimal> interestMap = new HashMap<>();
        Map<Long, BigDecimal> profitMap = new HashMap<>();

        for (StageName stageName : stages) {

            List<Investment> stageInvestments =
                    investments.stream()
                            .filter(i ->
                                    i.getStage()
                                            .getStageName()
                                            == stageName)
                            .toList();

            if (stageInvestments.isEmpty()) {
                continue;
            }

            BigDecimal stagePool =
                    investorProfitPool.multiply(
                            getStagePercentage(stageName));

            BigDecimal totalStageInvestment =
                    stageInvestments.stream()
                            .map(Investment::getAmount)
                            .reduce(
                                    BigDecimal.ZERO,
                                    BigDecimal::add);

            for (Investment investment : stageInvestments) {

                BigDecimal ratio =
                        investment.getAmount()
                                .divide(
                                        totalStageInvestment,
                                        8,
                                        RoundingMode.HALF_UP);

                BigDecimal profitEarned =
                        stagePool.multiply(ratio);

                long daysBetween =
                        ChronoUnit.DAYS.between(
                                investment.getInvestedAt().toLocalDate(),
                                settlement.getSettledAt().toLocalDate()) + 1;

                BigDecimal years =
                        BigDecimal.valueOf(daysBetween)
                                .divide(
                                        BigDecimal.valueOf(365),
                                        8,
                                        RoundingMode.HALF_UP);

                BigDecimal interest =
                        investment.getAmount()
                                .multiply(new BigDecimal("0.12"))
                                .multiply(years)
                                .setScale(2, RoundingMode.HALF_UP);

                Long investorId =
                        investment.getInvestor().getId();

                investorMap.put(
                        investorId,
                        investment.getInvestor());

                investedMap.merge(
                        investorId,
                        investment.getAmount(),
                        BigDecimal::add);

                interestMap.merge(
                        investorId,
                        interest,
                        BigDecimal::add);

                profitMap.merge(
                        investorId,
                        profitEarned,
                        BigDecimal::add);
            }
        }

        for (Long investorId : investorMap.keySet()) {

            BigDecimal totalInvested =
                    investedMap.getOrDefault(
                            investorId,
                            BigDecimal.ZERO);

            BigDecimal totalInterest =
                    interestMap.getOrDefault(
                            investorId,
                            BigDecimal.ZERO);

            BigDecimal totalProfit =
                    profitMap.getOrDefault(
                            investorId,
                            BigDecimal.ZERO);

            InvestorEarning earning =
                    new InvestorEarning();

            earning.setInvestor(
                    investorMap.get(investorId));

            earning.setMovie(movie);

            earning.setInvestedAmount(
                    totalInvested);

            earning.setInterestEarned(
                    totalInterest);

            earning.setProfitEarned(
                    totalProfit);

            earning.setLossAmount(
                    BigDecimal.ZERO);

            earning.setTotalReceived(
                    totalInvested
                            .add(totalInterest)
                            .add(totalProfit));

            earning.setCreatedAt(
                    LocalDateTime.now());

            earningRepository.save(earning);
        }
    }
    
    
    
    public InvestorDashboardDTO getDashboard(Long investorId) {

        List<Investment> investments =
                investmentRepository.findByInvestorId(investorId);

        List<InvestorEarning> earnings =
                earningRepository.findByInvestorId(investorId);

        InvestorDashboardDTO dashboard =
                new InvestorDashboardDTO();

        // Total Invested

        BigDecimal totalInvested =
                investments.stream()
                        .map(Investment::getAmount)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add);

        dashboard.setTotalInvested(totalInvested);

        // Total Received

        BigDecimal totalReceived =
                earnings.stream()
                        .map(InvestorEarning::getTotalReceived)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add);

        dashboard.setTotalReceived(totalReceived);

        // Total Profit

        BigDecimal totalProfit =
                earnings.stream()
                        .map(InvestorEarning::getProfitEarned)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add);

        dashboard.setTotalProfit(totalProfit);

        // Total Loss

        BigDecimal totalLoss =
                earnings.stream()
                        .map(InvestorEarning::getLossAmount)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add);

        dashboard.setTotalLoss(totalLoss);

        dashboard.setMovies(
                buildMovieSummaries(
                        investments,
                        earnings));

        return dashboard;
    }
    
    
    private List<InvestorMovieSummaryDTO> buildMovieSummaries(
            List<Investment> investments,
            List<InvestorEarning> earnings) {

        Map<Long, List<Investment>> movieInvestments =
                investments.stream()
                        .collect(
                                Collectors.groupingBy(
                                        investment ->
                                                investment.getMovie().getId()));

        List<InvestorMovieSummaryDTO> result =
                new ArrayList<>();

        for (Map.Entry<Long, List<Investment>> entry :
                movieInvestments.entrySet()) {

            Long movieId = entry.getKey();

            List<Investment> movieInvs =
                    entry.getValue();

            Movie movie =
                    movieInvs.get(0).getMovie();

            BigDecimal invested =
                    movieInvs.stream()
                            .map(Investment::getAmount)
                            .reduce(
                                    BigDecimal.ZERO,
                                    BigDecimal::add);

            InvestorMovieSummaryDTO dto =
                    new InvestorMovieSummaryDTO();

            dto.setMovieId(movieId);

            dto.setMovieTitle(
                    movie.getTitle());

            dto.setTotalInvested(invested);

            Optional<InvestorEarning> earning =
                    earnings.stream()
                            .filter(e ->
                                    e.getMovie()
                                            .getId()
                                            .equals(movieId))
                            .findFirst();

            if (earning.isPresent()) {

                InvestorEarning e =
                        earning.get();

                dto.setInterestEarned(
                        e.getInterestEarned());

                dto.setProfitEarned(
                        e.getProfitEarned());

                dto.setLossAmount(
                        e.getLossAmount());

                dto.setTotalReceived(
                        e.getTotalReceived());

                dto.setStatus(
                        e.getLossAmount()
                                .compareTo(BigDecimal.ZERO) > 0
                                ? "LOSS"
                                : "PROFIT");

            } else {

                dto.setInterestEarned(
                        BigDecimal.ZERO);

                dto.setProfitEarned(
                        BigDecimal.ZERO);

                dto.setLossAmount(
                        BigDecimal.ZERO);

                dto.setTotalReceived(
                        BigDecimal.ZERO);

                dto.setStatus("ACTIVE");
            }

            result.add(dto);
        }

        return result;
    }
    
    
}
