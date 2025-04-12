package com.example.inventry.security;

import com.example.inventry.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.stereotype.Component;
import org.springframework.lang.NonNull;
import org.springframework.http.HttpStatus;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Map;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final ObjectMapper objectMapper;

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

        // Skip JWT validation for public endpoints
        if ((path.startsWith("/api/inventory") && method.equals("GET")) ||
                path.startsWith("/api/auth/") ||
                path.startsWith("/api/v1/delivery") ||
                path.startsWith("/api/bank-slips")) {
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
                return;
            }
        }

        filterChain.doFilter(request, response); // ✅ Always continue the chain if no explicit error
    }


    private void sendErrorResponse(HttpServletResponse response, String message, HttpStatus status) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        response.getWriter().write(objectMapper.writeValueAsString(
                Map.of("success", false, "message", message)
        ));
    }
}
