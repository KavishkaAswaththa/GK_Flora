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

@Component // Marks this as a Spring-managed component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService; // Service to generate & validate JWT tokens
    private final UserDetailsService userDetailsService; // Loads user info from database
    private final ObjectMapper objectMapper; // Used to send JSON error responses

    // Hardcoded admin emails — used for assigning ROLE_ADMIN
    private static final Set<String> ADMIN_EMAILS = Set.of(
            "gamindumpasan1997@gmail.com",
            "kavindiyapa1999@gmail.com",
            "dinithi0425@gmail.com"
    );

    // Constructor-based dependency injection
    public JwtAuthFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.objectMapper = new ObjectMapper(); // Initialize object mapper
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String path = request.getRequestURI();
        final String method = request.getMethod();

        try {
            // Allow unauthenticated access to specific public endpoints
            if ((path.startsWith("/api/inventory") && method.equals("GET")) ||
                    path.startsWith("/api/auth/") ||
                    path.startsWith("/api/users") && method.equals("GET") ||
                    path.startsWith("/api/v1/delivery") ||
                    path.startsWith("/api/bank-slips") ||
                    path.equals("/api/flowers") ||
                    path.equals("/api/wishlist") ||

                    path.equals("/api/banners") ||

                    path.equals("/api/flowers/all") ||
                    path.equals("/api/wrappingPapers") ||
                    path.equals("/email/upload-slip") ||
                    (path.equals("/api/flowers/update") && method.equals("PUT"))) {
                filterChain.doFilter(request, response);
                return;
            }

            // Extract the Authorization header
            final String authHeader = request.getHeader("Authorization");

            // If no token is found or doesn't start with "Bearer ", reject the request
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                sendErrorResponse(response, "No token provided", HttpStatus.UNAUTHORIZED);
                return;
            }

            // Remove "Bearer " prefix and extract the email from the token
            final String jwt = authHeader.substring(7);
            final String userEmail = jwtService.extractUsername(jwt);

            // Continue only if the user is not already authenticated
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                // Validate token
                if (jwtService.validateToken(jwt, userDetails)) {

                    // Define authorities based on user's email
                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();

                    // Grant ADMIN role if userEmail is in the admin list
                    if (ADMIN_EMAILS.contains(userEmail)) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                    }

                    // Every authenticated user gets USER role
                    authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

                    // Set authentication in the security context
                    var auth = new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(auth);

                    // Proceed with the request
                    filterChain.doFilter(request, response);
                    return;
                }
            }

            // If token is invalid or user cannot be authenticated
            sendErrorResponse(response, "Invalid token", HttpStatus.UNAUTHORIZED);

        } catch (Exception e) {
            // Handle unexpected authentication errors
            sendErrorResponse(response, "Authentication failed: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    // Utility method to send a JSON error response
    private void sendErrorResponse(HttpServletResponse response, String message, HttpStatus status) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        response.getWriter().write(objectMapper.writeValueAsString(
                Map.of("success", false, "message", message)
        ));
    }
}