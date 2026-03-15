package com.bikeparts.controller;

import com.bikeparts.model.User;
import com.bikeparts.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    /**
     * GET /api/users/me
     * Returns the currently logged-in user's full profile (including address).
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMe(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .map(user -> ResponseEntity.ok(toDto(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * PUT /api/users/profile
     * Updates name, phone, and default address fields.
     * Email and role cannot be changed here.
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody Map<String, String> body,
            Authentication auth) {

        return userRepository.findByEmail(auth.getName()).map(user -> {
            if (body.containsKey("name")    && body.get("name")    != null) user.setName(body.get("name").trim());
            if (body.containsKey("phone")   && body.get("phone")   != null) user.setPhone(body.get("phone").trim());
            if (body.containsKey("address") && body.get("address") != null) user.setAddress(body.get("address").trim());
            if (body.containsKey("city")    && body.get("city")    != null) user.setCity(body.get("city").trim());
            if (body.containsKey("state")   && body.get("state")   != null) user.setState(body.get("state").trim());
            if (body.containsKey("pincode") && body.get("pincode") != null) user.setPincode(body.get("pincode").trim());

            User saved = userRepository.save(user);
            return ResponseEntity.ok(toDto(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> toDto(User u) {
        return Map.of(
                "id",      u.getId(),
                "name",    u.getName()    != null ? u.getName()    : "",
                "email",   u.getEmail()   != null ? u.getEmail()   : "",
                "phone",   u.getPhone()   != null ? u.getPhone()   : "",
                "role",    u.getRole().name(),
                "address", u.getAddress() != null ? u.getAddress() : "",
                "city",    u.getCity()    != null ? u.getCity()    : "",
                "state",   u.getState()   != null ? u.getState()   : "",
                "pincode", u.getPincode() != null ? u.getPincode() : ""
        );
    }
}