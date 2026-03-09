package com.cyberxdelta.Onboarding_Automation.exception;

public class PingOneApiException extends RuntimeException {

    public PingOneApiException(String message) {
        super(message);
    }

    public PingOneApiException(String message, Throwable cause) {
        super(message, cause);
    }
}