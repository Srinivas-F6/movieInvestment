package com.movie.platform.repository;

import com.movie.platform.model.MovieImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieImageRepository
        extends JpaRepository<MovieImage, Long> {
}