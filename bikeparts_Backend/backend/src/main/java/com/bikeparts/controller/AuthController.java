package com.bikeparts.controller;

import com.bikeparts.model.User;
import com.bikeparts.repository.UserRepository;
import com.bikeparts.security.JwtUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    // ── Register ──────────────────────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorBody("Email already registered"));
        }

        User user = User.builder()
                .name(req.name())
                .email(req.email())
                .phone(req.phone())
                .password(passwordEncoder.encode(req.password()))
                .address(req.address())
                .city(req.city())
                .state(req.state())
                .pincode(req.pincode())
                .role(User.Role.CUSTOMER)
                .build();

        userRepository.save(user);
        String token = jwtUtil.generateToken(user, user.getRole().name());
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token, toDto(user)));
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );
        System.out.println(new BCryptPasswordEncoder().encode("Admin@1234"));
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String token = jwtUtil.generateToken(user, user.getRole().name());
        return ResponseEntity.ok(new AuthResponse(token, toDto(user)));
    }

    // ── Admin Login ───────────────────────────────────────────────────────────
    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@Valid @RequestBody LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorBody("Admin access required"));
        }
        String token = jwtUtil.generateToken(user, user.getRole().name());
        return ResponseEntity.ok(new AuthResponse(token, toDto(user)));
    }

    private UserDto toDto(User u) {
        return new UserDto(u.getId(), u.getName(), u.getEmail(), u.getPhone(), u.getRole().name(),
                u.getAddress(), u.getCity(), u.getState(), u.getPincode());
    }

    // ── DTOs ─────────────────────────────────────────────────────────────────
    public record RegisterRequest(
            @NotBlank String name,
            @Email @NotBlank String email,
            @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid phone number") String phone,
            @Size(min = 8, message = "Password must be at least 8 characters") String password,
            String address,
            String city,
            String state,
            String pincode
    ) {}

    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}
    public record AuthResponse(String token, UserDto user) {}
    public record UserDto(Long id, String name, String email, String phone, String role,
                          String address, String city, String state, String pincode) {}
    public record ErrorBody(String message) {}
}