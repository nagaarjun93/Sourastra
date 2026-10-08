package com.sourashtra.learn.security;

import com.sourashtra.learn.model.User;
import com.sourashtra.learn.repository.UserRepository;
import com.sourashtra.learn.util.InMemoryDataStore;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final InMemoryDataStore inMemoryDataStore;

    public CustomUserDetailsService(UserRepository userRepository, InMemoryDataStore inMemoryDataStore) {
        this.userRepository = userRepository;
        this.inMemoryDataStore = inMemoryDataStore;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = null;
        try {
            user = userRepository.findByEmail(email).orElse(null);
        } catch (Exception ignored) {}

        if (user == null) {
            user = inMemoryDataStore.getUsers().get(email.toLowerCase());
        }

        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.getRoles().stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList())
        );
    }
}
