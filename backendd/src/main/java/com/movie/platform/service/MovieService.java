	package com.movie.platform.service;

import com.movie.platform.model.*;
import com.movie.platform.repository.MovieRepository;
import com.movie.platform.repository.UserRepository;
import com.movie.platform.repository.MovieImageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
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

    @Autowired
    private MovieImageRepository movieImageRepository;

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
    public Movie createMovie(
            Movie movie,
            List<MultipartFile> images,
            Long producerId
    ) {

        User producer = userRepository.findById(producerId)
                .orElseThrow(() ->
                        new RuntimeException("Producer not found"));

        movie.setProducer(producer);

        
        if(movie.getCast() == null){
            movie.setCast(new ArrayList<>());
        }

        if(movie.getCrew() == null){
            movie.setCrew(new ArrayList<>());
        }
        Movie savedMovie = movieRepository.save(movie);

        // SAVE IMAGES
        if (images != null && !images.isEmpty()) {

            List<MovieImage> movieImages = new ArrayList<>();

            for (MultipartFile file : images) {

                try {

                    String fileName =
                            UUID.randomUUID() + "_" + file.getOriginalFilename();

                    Path path = Paths.get(UPLOAD_DIR + fileName);

                    Files.createDirectories(path.getParent());

                    Files.write(path, file.getBytes());

                    MovieImage movieImage = new MovieImage();

                    movieImage.setImageUrl("/uploads/movies/" + fileName);

                    movieImage.setMovie(savedMovie);

                    movieImages.add(movieImage);

                } catch (IOException e) {
                    throw new RuntimeException("Image upload failed");
                }
            }

            movieImageRepository.saveAll(movieImages);

            savedMovie.setImages(movieImages);
        }

        return movieRepository.save(savedMovie);
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
}