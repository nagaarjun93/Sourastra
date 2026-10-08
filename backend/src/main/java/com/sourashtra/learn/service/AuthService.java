package com.sourashtra.learn.service;

import com.sourashtra.learn.dto.AuthRequest;
import com.sourashtra.learn.dto.AuthResponse;
import com.sourashtra.learn.dto.RegisterRequest;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    AuthResponse register(RegisterRequest request);
}
