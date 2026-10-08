const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
function writeFile(relPath, content) {
    const fullPath = path.isAbsolute(relPath) ? relPath : path.join(baseDir, relPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
    console.log('Wrote:', path.relative(baseDir, fullPath), `(${Buffer.byteLength(content, 'utf8')} bytes)`);
}

// Security: JwtTokenProvider
writeFile('src/main/java/com/sourashtra/learn/security/JwtTokenProvider.java', `
package com.sourashtra.learn.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("\${jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}")
    private String jwtSecret;

    @Value("\${jwt.expiration:86400000}")
    private long jwtExpirationInMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(this.jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Authentication authentication) {
        String username;
        if (authentication.getPrincipal() instanceof UserDetails) {
            username = ((UserDetails) authentication.getPrincipal()).getUsername();
        } else {
            username = authentication.getPrincipal().toString();
        }

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSignKey())
                .compact();
    }

    public String generateTokenFromUsername(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSignKey())
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith(getSignKey())
                    .build()
                    .parseSignedClaims(authToken);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }
}
`);

// Security: CustomUserDetailsService
writeFile('src/main/java/com/sourashtra/learn/security/CustomUserDetailsService.java', `
package com.sourashtra.learn.security;

import com.sourashtra.learn.model.User;
import com.sourashtra.learn.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.getRoles().stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList())
        );
    }
}
`);

// Security: JwtAuthenticationFilter
writeFile('src/main/java/com/sourashtra/learn/security/JwtAuthenticationFilter.java', `
package com.sourashtra.learn.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, CustomUserDetailsService customUserDetailsService) {
        this.tokenProvider = tokenProvider;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String username = tokenProvider.getUsernameFromToken(jwt);
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
`);

// Security: SecurityConfig
writeFile('src/main/java/com/sourashtra/learn/security/SecurityConfig.java', `
package com.sourashtra.learn.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/words/**").permitAll()
                .requestMatchers("/api/lessons/**").permitAll()
                .requestMatchers("/api/quiz/**").permitAll()
                .requestMatchers("/api/ai/**").permitAll()
                .requestMatchers("/api/health").permitAll()
                .requestMatchers("/api/progress/**").permitAll()
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
`);

// Util: AppConstants
writeFile('src/main/java/com/sourashtra/learn/util/AppConstants.java', `
package com.sourashtra.learn.util;

public final class AppConstants {
    private AppConstants() {}

    public static final String SOURCE_PDF_NAME = "Learn-English-Through-Sourashtra.pdf";
    public static final String AI_NOT_AVAILABLE_MESSAGE = "This information is not available in the current verified Sourashtra knowledge base.";
}
`);

// Util: DatabaseInitializer
writeFile('src/main/java/com/sourashtra/learn/util/DatabaseInitializer.java', `
package com.sourashtra.learn.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sourashtra.learn.model.Lesson;
import com.sourashtra.learn.model.QuizQuestion;
import com.sourashtra.learn.model.Word;
import com.sourashtra.learn.repository.LessonRepository;
import com.sourashtra.learn.repository.QuizQuestionRepository;
import com.sourashtra.learn.repository.WordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);

    private final WordRepository wordRepository;
    private final LessonRepository lessonRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final ObjectMapper objectMapper;

    public DatabaseInitializer(WordRepository wordRepository,
                               LessonRepository lessonRepository,
                               QuizQuestionRepository quizQuestionRepository,
                               ObjectMapper objectMapper) {
        this.wordRepository = wordRepository;
        this.lessonRepository = lessonRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) {
        log.info("Checking database initialization status...");
        try {
            // Find data directory path
            File wordsFile = findDataFile("verified_seed_words.json");
            File lessonsFile = findDataFile("verified_seed_lessons.json");
            File quizFile = findDataFile("verified_seed_quiz.json");

            if (wordRepository.count() == 0 && wordsFile != null && wordsFile.exists()) {
                List<Word> words = objectMapper.readValue(wordsFile, new TypeReference<List<Word>>() {});
                wordRepository.saveAll(words);
                log.info("Initialized {} verified Sourashtra words from {}", words.size(), wordsFile.getName());
            } else {
                log.info("Word repository already contains {} records.", wordRepository.count());
            }

            if (lessonRepository.count() == 0 && lessonsFile != null && lessonsFile.exists()) {
                List<Lesson> lessons = objectMapper.readValue(lessonsFile, new TypeReference<List<Lesson>>() {});
                lessonRepository.saveAll(lessons);
                log.info("Initialized {} verified Sourashtra lessons from {}", lessons.size(), lessonsFile.getName());
            } else {
                log.info("Lesson repository already contains {} records.", lessonRepository.count());
            }

            if (quizQuestionRepository.count() == 0 && quizFile != null && quizFile.exists()) {
                List<QuizQuestion> questions = objectMapper.readValue(quizFile, new TypeReference<List<QuizQuestion>>() {});
                quizQuestionRepository.saveAll(questions);
                log.info("Initialized {} verified quiz questions from {}", questions.size(), quizFile.getName());
            } else {
                log.info("Quiz repository already contains {} records.", quizQuestionRepository.count());
            }

        } catch (Exception e) {
            log.error("Failed to seed initial verified Sourashtra data: {}", e.getMessage(), e);
        }
    }

    private File findDataFile(String filename) {
        String[] candidatePaths = {
            "../data/sourashtra/" + filename,
            "data/sourashtra/" + filename,
            "../../data/sourashtra/" + filename,
            "C:/Users/NAGA ARJUN/Documents/Sourastra/sourashtra-learn/data/sourashtra/" + filename
        };
        for (String path : candidatePaths) {
            File f = new File(path);
            if (f.exists()) {
                return f;
            }
        }
        return null;
    }
}
`);

console.log('Security and Util generation finished.');
