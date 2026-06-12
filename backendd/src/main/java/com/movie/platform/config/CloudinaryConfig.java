package com.movie.platform.config;

import org.springframework.context.annotation.Bean;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dwegwwwbn",
                "api_key", "134794926829326",
                "api_secret", "xh4IK60CzqK5UTIvd96vCiPQDNE"
        ));
    }
}