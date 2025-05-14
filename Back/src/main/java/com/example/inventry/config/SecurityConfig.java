package com.example.inventry.config;

import com.example.inventry.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration // Marks this as a configuration class
@EnableWebSecurity // Enables Spring Security web security support
@RequiredArgsConstructor // Lombok will generate a constructor for final fields
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter; // Custom filter to validate JWT tokens
    private final UserDetailsService userDetailsService; // Loads user-specific data

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF protection as JWT is used (stateless)
                .csrf(csrf -> csrf.disable())

                // Enable CORS with custom configuration
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Define authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints (no authentication required)
                        .requestMatchers(
                                "/api/inventory",
                                "/api/inventory/**",
                                "/api/inventory/search/all",
                                "/api/auth/**",               // Auth endpoints like login, register
                                "/api/v1/delivery/**",        // All delivery-related endpoints
                                "/api/bank-slips/**",         // All bank slip-related endpoints
                                "/email/**"                   // Email-related endpoints
                        ).permitAll()

                        // All other endpoints require authentication
                        .anyRequest().authenticated()
                )

                // Stateless session policy for REST APIs
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Set authentication provider and custom JWT filter
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build(); // Build the security filter chain
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow requests from frontend origin (adjust as needed for deployment)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));

        // Allow typical HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Allow these headers in requests
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));

        // Expose the Authorization header so frontend can access it
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        // Allow sending credentials like cookies (not used with JWT usually, but safe here)
        configuration.setAllowCredentials(true);

        // Apply this CORS configuration to all routes
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        // Use DaoAuthenticationProvider with custom user details service and password encoder
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); // User fetching logic
        authProvider.setPasswordEncoder(passwordEncoder());     // Encode passwords using BCrypt
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        // Expose AuthenticationManager from configuration
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Strong hashing algorithm for passwords
        return new BCryptPasswordEncoder();
    }
}
