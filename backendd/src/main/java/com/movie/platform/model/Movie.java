package com.movie.platform.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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

    @NotBlank(message = "Title is required")
    @Size(max = 255)
    private String title;

    @NotBlank(message = "Description required")
    @Size(max = 3000)
    @Column(length = 3000)
    private String description;

    @NotEmpty(message = "Cast required")
    @ElementCollection
    @CollectionTable(
        name = "movie_cast",
        joinColumns = @JoinColumn(name = "movie_id")
    )
    @OrderColumn(name = "cast_index")
    @Column(name = "cast_member")
    private List<String> cast = new ArrayList<>();

    @NotEmpty(message = "Crew required")
    @ElementCollection
    @CollectionTable(
        name = "movie_crew",
        joinColumns = @JoinColumn(name = "movie_id")
    )
    @OrderColumn(name = "crew_index")
    @Column(name = "crew_member")
    private List<String> crew = new ArrayList<>();

    @NotNull
    @DecimalMin(value = "1.0", message = "Funding must be positive")
    @Column(name = "target_funding")
    private BigDecimal targetFunding;

    @Column(name = "current_funding")
    private BigDecimal currentFunding = BigDecimal.ZERO;

    @NotNull
    @DecimalMin(value = "1.0")
    private BigDecimal slotPrice;
    
    @Column(name = "profit")
    private BigDecimal profit = BigDecimal.ZERO;
    @Column(name = "loss")
    private BigDecimal loss = BigDecimal.ZERO;
    


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "producer_id")
    private User producer;

    @Enumerated(EnumType.STRING)
    private MovieStatus status = MovieStatus.PENDING;
    	
    private Boolean hidden = false;
    // MOVIE IMAGES 
    
    private String imageUrl;

    // STAGE-WISE FUNDING
    @JsonManagedReference
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    private List<InvestmentStage> stages = new ArrayList<>();

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {

        createdAt = LocalDateTime.now();
        
        if(hidden == null) {
        	hidden = false;
        }

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
        REJECTED,
        COMPLETED				
    }
}