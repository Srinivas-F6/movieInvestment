package com.movie.platform.repository;

import com.movie.platform.model.Investment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    List<Investment> findByInvestorId(Long investorId);
    List<Investment> findByMovieId(Long movieId);
	boolean existsByStageId(Long stageId);
}
