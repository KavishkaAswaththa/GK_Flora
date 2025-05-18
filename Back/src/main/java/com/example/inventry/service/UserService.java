package com.example.inventry.service;

import com.example.inventry.entity.User;
import com.example.inventry.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> updateUserProfile(String email, User updatedData) {
        return userRepository.findByEmail(email).map(existingUser -> {
            existingUser.setName(updatedData.getName());
            existingUser.setMobileNo(updatedData.getMobileNo());
            existingUser.setBirthday(updatedData.getBirthday());
            existingUser.setAddress(updatedData.getAddress());
            return userRepository.save(existingUser);
        });
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public boolean deleteUserById(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean deleteUserByEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            userRepository.deleteById(userOpt.get().getId());
            return true;
        }
        return false;
    }
}
