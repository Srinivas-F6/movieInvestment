package com.movie.platform.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.movie.platform.model.InvestmentStage;

public interface InvestmentStageRepository extends JpaRepository<InvestmentStage,Long>{

	 List<InvestmentStage> findByMovieId(Long movieId);
}
