package com.movie.platform.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.movie.platform.model.MovieSettlement;

public interface MoiveSettlementRepository extends JpaRepository<MovieSettlement, Long> {
	Optional<MovieSettlement> findByMovieId(Long movieId);
}
