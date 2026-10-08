package com.sourashtra.learn.service;

import com.sourashtra.learn.dto.AIAskResponse;

public interface AIService {
    AIAskResponse askQuestion(String question);
}
