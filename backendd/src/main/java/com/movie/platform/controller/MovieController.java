package com.movie.platform.controller;

import com.movie.platform.model.Movie;
import com.movie.platform.service.MovieService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*")
public class MovieController {

    @Autowired
    private MovieService movieService;

    // GET ALL MOVIES
    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    // GET MOVIE BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }

    // GET MOVIES BY PRODUCER
    @GetMapping("/producer/{producerId}")
    public ResponseEntity<List<Movie>> getMoviesByProducer(
            @PathVariable Long producerId
    ) {
        return ResponseEntity.ok(
                movieService.getMoviesByProducer(producerId)
        );
    }

    // CREATE MOVIE
    @PostMapping(value = "/producer/{producerId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Movie> createMovie(

            @RequestPart("movie") Movie movie,
            @RequestPart(value = "images", required = false)
            List<MultipartFile> images,

            @PathVariable Long producerId
    ) {


        return ResponseEntity.ok(
                movieService.createMovie(movie, images, producerId)
        );
    }

    // UPDATE MOVIE STATUS
    @PutMapping("/{movieId}/status")
    public ResponseEntity<Movie> updateStatus(
            @PathVariable Long movieId,
            @RequestParam Movie.MovieStatus status
    ) {

        return ResponseEntity.ok(
                movieService.updateMovieStatus(movieId, status)
        );
    }
    
//    Search Movies
    @GetMapping("/search")
    public ResponseEntity<List<Movie>> searchMovies(
            @RequestParam String title
    ) {

        return ResponseEntity.ok(
                movieService.searchMovies(title)
        );
    }
}