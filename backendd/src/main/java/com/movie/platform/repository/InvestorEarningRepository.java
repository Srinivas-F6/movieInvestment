package com.movie.platform.repository;

import com.movie.platform.model.InvestorEarning;
import com.movie.platform.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestorEarningRepository
        extends JpaRepository<InvestorEarning, Long> {

    List<InvestorEarning> findByInvestor(User investor);

    List<InvestorEarning> findByInvestorId(Long investorId);

    List<InvestorEarning> findByMovieId(Long movieId);
}