package com.bikeparts.controller;

import com.bikeparts.model.ContactMessage;
import com.bikeparts.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ContactController {

    private final ContactMessageRepository contactRepo;

    // ── PUBLIC: anyone can submit a contact message ───────────────────────────
    @PostMapping("/contact")
    public ResponseEntity<?> submitMessage(@RequestBody ContactMessage msg) {
        if (msg.getName()    == null || msg.getName().isBlank()    ||
                msg.getEmail()   == null || msg.getEmail().isBlank()   ||
                msg.getSubject() == null || msg.getSubject().isBlank() ||
                msg.getMessage() == null || msg.getMessage().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "All fields are required"));
        }
        msg.setIsRead(false);
        ContactMessage saved = contactRepo.save(msg);
        return ResponseEntity.ok(Map.of(
                "message", "Message sent successfully",
                "id",      saved.getId()
        ));
    }

    // ── ADMIN: get all messages ───────────────────────────────────────────────
    @GetMapping("/admin/messages")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        return ResponseEntity.ok(contactRepo.findAllByOrderByCreatedAtDesc());
    }

    // ── ADMIN: mark message as read ───────────────────────────────────────────
    @PutMapping("/admin/messages/{id}/read")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        return contactRepo.findById(id).map(msg -> {
            msg.setIsRead(true);
            return ResponseEntity.ok(contactRepo.save(msg));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── ADMIN: delete message ─────────────────────────────────────────────────
    @DeleteMapping("/admin/messages/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        if (!contactRepo.existsById(id)) return ResponseEntity.notFound().build();
        contactRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }

    // ── ADMIN: unread count for dashboard badge ───────────────────────────────
    @GetMapping("/admin/messages/unread-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> unreadCount() {
        return ResponseEntity.ok(Map.of("count", contactRepo.countByIsReadFalse()));
    }
}