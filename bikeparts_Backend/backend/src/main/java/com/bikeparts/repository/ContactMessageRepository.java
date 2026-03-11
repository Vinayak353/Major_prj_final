package com.bikeparts.repository;

import com.bikeparts.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    // All messages newest first (for admin panel)
    List<ContactMessage> findAllByOrderByCreatedAtDesc();

    // Count unread messages (for dashboard badge)
    long countByIsReadFalse();
}