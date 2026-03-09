package com.cyberxdelta.Onboarding_Automation.service;

import com.cyberxdelta.Onboarding_Automation.dto.PingOneTokenResponseDto;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.BodyInserters;
import reactor.core.publisher.Mono;

import java.util.Date;
import java.time.Instant;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class TokenService {
    private static final Logger logger = LoggerFactory.getLogger(TokenService.class);

    @Value("${pingone.client-id}")
    private String clientId;

    @Value("${pingone.client-secret}")
    private String clientSecret;

    @Value("${pingone.auth-url}")
    private String authUrl;

    @Value("${jwt.secret:mySecretKeyForJWTTokenGeneration}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpirationMs;

    private final WebClient webClient;
    private final AtomicReference<String> cachedToken = new AtomicReference<>();
    private final AtomicReference<Instant> expiryTime = new AtomicReference<>(Instant.EPOCH);

    public TokenService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public synchronized Mono<String> getAccessToken() {
        Instant now = Instant.now();
        if (cachedToken.get() != null && now.isBefore(expiryTime.get())) {
            logger.info("Using cached PingOne access token.");
            return Mono.just(cachedToken.get());
        }
        logger.info("Fetching new PingOne access token from: {}", authUrl);
        return webClient.post()
                .uri(authUrl)
                .headers(headers -> headers.setBasicAuth(clientId, clientSecret))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .body(BodyInserters.fromFormData("grant_type", "client_credentials")
                        .with("scope", "openid"))
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(),
                        response -> response.bodyToMono(String.class).flatMap(body -> {
                            logger.error("Failed to fetch PingOne token. Status: {}, Body: {}", response.statusCode(),
                                    body);
                            return Mono.error(new RuntimeException("PingOne Token Error: " + response.statusCode()));
                        }))
                .bodyToMono(PingOneTokenResponseDto.class)
                .doOnNext(tokenResponse -> {
                    cachedToken.set(tokenResponse.getAccess_token());
                    // Use actual expires_in if available, else default to 1 hour
                    int expiresSeconds = tokenResponse.getExpires_in() > 0 ? tokenResponse.getExpires_in() : 3600;
                    expiryTime.set(now.plusSeconds(expiresSeconds - 60)); // 60s buffer
                    logger.info("Successfully obtained PingOne access token. Expires in {}s", expiresSeconds);
                })
                .map(PingOneTokenResponseDto::getAccess_token)
                .doOnError(e -> logger.error("Critical error fetching PingOne token: {}", e.getMessage()));
    }

    public String generateToken(String userId) {
        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String extractUserIdFromToken(String token) {
        try {
            Claims claims = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
            return claims.getSubject();
        } catch (Exception e) {
            return null;
        }
    }
}
