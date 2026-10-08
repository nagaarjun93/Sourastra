package com.sourashtra.learn.service;

import com.sourashtra.learn.dto.AuthRequest;
import com.sourashtra.learn.dto.AuthResponse;
import com.sourashtra.learn.dto.RegisterRequest;
import com.sourashtra.learn.model.User;
import com.sourashtra.learn.model.UserProgress;
import com.sourashtra.learn.repository.UserProgressRepository;
import com.sourashtra.learn.repository.UserRepository;
import com.sourashtra.learn.security.JwtTokenProvider;
import com.sourashtra.learn.util.InMemoryDataStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final UserProgressRepository userProgressRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final InMemoryDataStore inMemoryDataStore;

    public AuthServiceImpl(UserRepository userRepository,
                           UserProgressRepository userProgressRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtTokenProvider tokenProvider,
                           InMemoryDataStore inMemoryDataStore) {
        this.userRepository = userRepository;
        this.userProgressRepository = userProgressRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.inMemoryDataStore = inMemoryDataStore;
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            User user = userRepository.findByEmail(request.getEmail()).orElse(null);
            if (user != null) {
                String token = tokenProvider.generateTokenFromUsername(user.getEmail());
                return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
            }
        } catch (Exception e) {
            log.debug("Mongo/AuthManager login exception, checking in-memory users: {}", e.getMessage());
        }

        // Fallback for in-memory user
        User memUser = inMemoryDataStore.getUsers().get(request.getEmail().toLowerCase());
        if (memUser != null && passwordEncoder.matches(request.getPassword(), memUser.getPassword())) {
            String token = tokenProvider.generateTokenFromUsername(memUser.getEmail());
            return new AuthResponse(token, memUser.getId(), memUser.getName(), memUser.getEmail());
        }

        throw new IllegalArgumentException("Invalid email or password");
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase();
        try {
            if (userRepository.existsByEmail(email)) {
                throw new IllegalArgumentException("Email is already registered: " + email);
            }

            User user = new User(
                    request.getName(),
                    email,
                    passwordEncoder.encode(request.getPassword())
            );
            User savedUser = userRepository.save(user);

            UserProgress progress = new UserProgress(savedUser.getId());
            userProgressRepository.save(progress);

            String token = tokenProvider.generateTokenFromUsername(savedUser.getEmail());
            return new AuthResponse(token, savedUser.getId(), savedUser.getName(), savedUser.getEmail());
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            log.warn("MongoDB unavailable during register, saving to in-memory store: {}", e.getMessage());
            if (inMemoryDataStore.getUsers().containsKey(email)) {
                throw new IllegalArgumentException("Email is already registered: " + email);
            }
            User user = new User(request.getName(), email, passwordEncoder.encode(request.getPassword()));
            user.setId(UUID.randomUUID().toString());
            inMemoryDataStore.getUsers().put(email, user);

            UserProgress progress = new UserProgress(user.getId());
            inMemoryDataStore.getUserProgressMap().put(user.getId(), progress);

            String token = tokenProvider.generateTokenFromUsername(user.getEmail());
            return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
        }
    }
}
