package com.example.inventry.security;

import com.example.inventry.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.lang.NonNull;
import org.springframework.http.HttpStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final ObjectMapper objectMapper;

    private static final Set<String> ADMIN_EMAILS = Set.of(
            "gamindumpasan1997@gmail.com",
            "kavindiyapa1999@gmail.com"
    );

    public JwtAuthFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String path = request.getRequestURI();
        final String method = request.getMethod();

<<<<<<< Updated upstream
        try {
            // Public endpoints (no authentication needed)
            if ((path.startsWith("/api/inventory") && method.equals("GET")) ||
                    path.startsWith("/api/auth/") ||
                    path.startsWith("/api/v1/delivery") ||
                    path.startsWith("/api/bank-slips")) {
                filterChain.doFilter(request, response);
=======
        // Skip JWT validation for public endpoints
        if (shouldSkipJwtValidation(path, method)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendErrorResponse(response, "No token provided", HttpStatus.UNAUTHORIZED);
            return;
        }

        final String jwt = authHeader.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            if (jwtService.validateToken(jwt, userDetails)) {
                SecurityContextHolder.getContext().setAuthentication(
                        jwtService.getAuthentication(jwt, userDetails)
                );
            } else {
                sendErrorResponse(response, "Invalid token", HttpStatus.UNAUTHORIZED);
>>>>>>> Stashed changes
                return;
            }

            final String authHeader = request.getHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                sendErrorResponse(response, "No token provided", HttpStatus.UNAUTHORIZED);
                return;
            }

            final String jwt = authHeader.substring(7);
            final String userEmail = jwtService.extractUsername(jwt);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                if (jwtService.validateToken(jwt, userDetails)) {
                    // Assign roles
                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    if (ADMIN_EMAILS.contains(userEmail)) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                    }
                    authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

                    var auth = new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    filterChain.doFilter(request, response);
                    return;
                }
            }

            sendErrorResponse(response, "Invalid token", HttpStatus.UNAUTHORIZED);

        } catch (Exception e) {
            sendErrorResponse(response, "Authentication failed: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
<<<<<<< Updated upstream
    }

=======

        filterChain.doFilter(request, response); //  Always continue the chain if no explicit error
    }

    // Helper method to check whether JWT validation should be skipped based on request path and method
    private boolean shouldSkipJwtValidation(String path, String method) {
        // Skip for public endpoints like /api/auth/ and some specific /api paths
        return (path.startsWith("/api/auth/") ||
                path.startsWith("/api/v1/delivery") ||
                path.startsWith("/api/inventory") && method.equals("GET") ||
                path.startsWith("/api/bank-slips"));
    }

>>>>>>> Stashed changes
    private void sendErrorResponse(HttpServletResponse response, String message, HttpStatus status) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        response.getWriter().write(objectMapper.writeValueAsString(
                Map.of("success", false, "message", message)
        ));
    }
}
