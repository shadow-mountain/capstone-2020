package com.l8z.jparepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.l8z.user_profile.User;

@Repository
public interface UserJpaRepository extends JpaRepository<User, Long> {
	User findByUsername(String username);
}
