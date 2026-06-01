	package com.movie.platform.service;

import com.movie.platform.model.*;
import com.movie.platform.repository.MovieRepository;
import com.movie.platform.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private UserRepository userRepository;

    private final String UPLOAD_DIR = "uploads/movies/";

    // GET ALL MOVIES
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    // GET MOVIE BY ID
    public Movie getMovieById(Long id) {

        return movieRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Movie not found"));
    }

    // GET MOVIES BY PRODUCER
    public List<Movie> getMoviesByProducer(Long producerId) {

        return movieRepository.findByProducerId(producerId);
    }

    // CREATE MOVIE
    @Transactional
    public Movie createMovie(
            Movie movie,
            MultipartFile image,
            Long producerId
    ) {

        // FIND PRODUCER
        User producer = userRepository.findById(producerId)
                .orElseThrow(() ->
                        new RuntimeException("Producer not found"));

        movie.setProducer(producer);

        // SAFE INITIALIZATION
        if (movie.getCast() == null) {
            movie.setCast(new ArrayList<>());
        }

        if (movie.getCrew() == null) {
            movie.setCrew(new ArrayList<>());
        }

        // IMAGE UPLOAD
        if (image != null && !image.isEmpty()) {

            try {

                // FILE SIZE CHECK (MAX 5MB)
                if (image.getSize() > 5 * 1024 * 1024) {

                    throw new RuntimeException(
                            "Image size exceeds 5MB"
                    );
                }

                // FILE TYPE CHECK
                String contentType =
                        image.getContentType();

                if (
                        contentType == null ||
                        (
                            !contentType.equals("image/jpeg") &&
                            !contentType.equals("image/png") &&
                            !contentType.equals("image/webp")
                        )
                ) {

                    throw new RuntimeException(
                            "Only JPG, PNG, WEBP images allowed"
                    );
                }

                // GENERATE UNIQUE FILE NAME
                String fileName =
                        UUID.randomUUID()
                        + "_"
                        + image.getOriginalFilename();

                
                Path path = Paths.get(
                        UPLOAD_DIR + fileName
                );

               Files.createDirectories(
                        path.getParent()
                );
                
                image.transferTo(path);
                
                movie.setImageUrl(
                        "/uploads/movies/" + fileName
                );

            } catch (IOException e) {

                throw new RuntimeException(
                        "Image upload failed"
                );
            }
        }

        return movieRepository.save(movie);
    }

    // UPDATE MOVIE STATUS
    public Movie updateMovieStatus(
            Long movieId,
            Movie.MovieStatus status
    ) {

        Movie movie = getMovieById(movieId);

        movie.setStatus(status);

        return movieRepository.save(movie);
    }
    
//    Search Moives by title
    public List<Movie> searchMovies(String title) {
        return movieRepository
                .findByTitleContainingIgnoreCase(title);
    }
    
    
    public void hideMovie(Long movieId) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new RuntimeException("Movie not found")
                );

        movie.setHidden(true);

        movieRepository.save(movie);
    }

    // UNHIDE MOVIE

    public void unhideMovie(Long movieId) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new RuntimeException("Movie not found")
                );

        movie.setHidden(false);

        movieRepository.save(movie);
    }
    
  //  Update Role
    public void updateRole(String email, Role role) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(role);

        userRepository.save(user);
    }
}