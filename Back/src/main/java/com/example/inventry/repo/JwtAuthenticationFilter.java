package com.example.inventry.repo;

import com.example.inventry.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.lang.NonNull;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain chain)
            throws ServletException, IOException {

        // Extract token from cookies
        Optional<Cookie> tokenCookie = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
                .filter(cookie -> "token".equals(cookie.getName()))
                .findFirst();

        if (tokenCookie.isEmpty()) {
            sendErrorResponse(response, "Not Authorized. Login Again", HttpStatus.UNAUTHORIZED);
            return;
        }

        String token = tokenCookie.get().getValue();

        try {
            Claims claims = jwtService.validateToken(token);
            request.setAttribute("userId", claims.get("id"));
            chain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            sendErrorResponse(response, "Token Expired. Login Again", HttpStatus.UNAUTHORIZED);
        } catch (JwtException e) {
            sendErrorResponse(response, "Invalid Token", HttpStatus.UNAUTHORIZED);
        }
    }

    private void sendErrorResponse(HttpServletResponse response, String message, HttpStatus status) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getWriter(),
                java.util.Map.of("success", false, "message", message));
    }
}

