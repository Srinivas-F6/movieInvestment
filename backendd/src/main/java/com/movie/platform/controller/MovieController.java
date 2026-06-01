package com.movie.platform.controller;

import com.movie.platform.model.Movie;
import com.movie.platform.model.Role;
import com.movie.platform.service.MovieService;

import org.hibernate.mapping.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
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
    @PreAuthorize("hasAnyRole('PRODUCER','ADMIN')")
    @GetMapping("/producer/{producerId}")
    public ResponseEntity<List<Movie>> getMoviesByProducer(
            @PathVariable Long producerId
    ) {
        return ResponseEntity.ok(
                movieService.getMoviesByProducer(producerId)
        );
    }

    // CREATE MOVIE
    @PreAuthorize("hasRole('PRODUCER')")
    @PostMapping(
            value = "/producer/{producerId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Movie> createMovie(
            @RequestPart("movie") Movie movie,
            @RequestPart(value = "image", required = false)
            MultipartFile image,
            @PathVariable Long producerId
    ) {
    	System.out.println("Byeeee");

        return ResponseEntity.ok(
                movieService.createMovie(
                        movie,
                        image,
                        producerId
                )
        );
    }

    // UPDATE MOVIE STATUS
    @PreAuthorize("hasRole('ADMIN')")
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
    
    
//  Movie hide and unhide
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{movieId}/hide")
    public ResponseEntity<?> hideMovie(
            @PathVariable Long movieId
    ) {

        movieService.hideMovie(movieId);

        HashMap<String, String> response = new HashMap<>();

        response.put(
                "message",
                "Movie hidden successfully"
        );

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{movieId}/unhide")
    public ResponseEntity<?> unhideMovie(
            @PathVariable Long movieId
    ) {

        movieService.unhideMovie(movieId);

        HashMap<String, String> response = new HashMap<>();

        response.put(
                "message",
                "Movie unhidden successfully"
        );

        return ResponseEntity.ok(response);
    }
    
    
//    Update Role
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/users/{email}/role")
    public ResponseEntity<?> updateRole(
            @PathVariable String email,
            @RequestParam Role role
    ) {

        movieService.updateRole(email, role);

        HashMap<String, String> response = new HashMap<>();

        response.put(
                "message",
                "Role Updated successfully"
        );

        return ResponseEntity.ok(response);
    }
}