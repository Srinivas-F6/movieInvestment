package com.movie.platform.repository;

import com.movie.platform.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByStatus(Movie.MovieStatus status);
    List<Movie> findByProducerId(Long producerId);
    List<Movie> findByTitleContainingIgnoreCase(String title);
}
