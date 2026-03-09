package com.cyberxdelta.Onboarding_Automation.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller to handle Single Page Application (SPA) routing.
 * Ensures that all non-API paths are forwarded to index.html so React Router
 * can handle them.
 */
@Controller
public class SpaController {

    @GetMapping("/login")
    public String login() {
        return "forward:/login.html";
    }

    @GetMapping("/register")
    public String register() {
        return "forward:/register.html";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "forward:/index.html";
    }

    @GetMapping("/onboard")
    public String onboard() {
        return "forward:/onboard.html";
    }

    @RequestMapping(value = {
            "/",
            "/{path:[^\\.]*}"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
