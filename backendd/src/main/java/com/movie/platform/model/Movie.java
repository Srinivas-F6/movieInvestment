package com.movie.platform.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 3000)
    private String description;

    @ElementCollection
    private List<String> crew = new ArrayList<>();

    @ElementCollection
    private List<String> cast = new ArrayList<>();

    @Column(name = "target_funding")
    private BigDecimal targetFunding;

    @Column(name = "current_funding")
    private BigDecimal currentFunding;

    // SLOT SYSTEM
    private BigDecimal slotPrice;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "producer_id")
    private User producer;

    @Enumerated(EnumType.STRING)
    private MovieStatus status = MovieStatus.PENDING;

    // MOVIE IMAGES
    
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    private List<MovieImage> images = new ArrayList<>();

    // STAGE-WISE FUNDING
    @JsonManagedReference
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    private List<InvestmentStage> stages = new ArrayList<>();

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {

        createdAt = LocalDateTime.now();

        if (currentFunding == null) {
            currentFunding = BigDecimal.ZERO;
        }

        if (status == null) {
            status = MovieStatus.PENDING;
        }

    }

    public enum MovieStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}