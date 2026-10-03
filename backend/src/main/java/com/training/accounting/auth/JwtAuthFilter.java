package com.training.accounting.auth;

import com.training.accounting.user.AppUser;
import com.training.accounting.user.AppUserRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
  private final JwtService jwtService;
  private final AppUserRepository users;

  public JwtAuthFilter(JwtService jwtService, AppUserRepository users) {
    this.jwtService = jwtService;
    this.users = users;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {

    String header = request.getHeader("Authorization");

    if (header == null || !header.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      Claims claims = jwtService.parse(header.substring(7));
      AppUser user = users.findByEmailIgnoreCase(claims.getSubject())
          .filter(AppUser::isActive)
          .orElse(null);

      if (user == null) {
        unauthorized(response, "User is inactive or no longer exists");
        return;
      }

      var authentication = new UsernamePasswordAuthenticationToken(
          user.getEmail(),
          null,
          List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole())));
      authentication.setDetails(user);
      SecurityContextHolder.getContext().setAuthentication(authentication);
      filterChain.doFilter(request, response);

    } catch (Exception ex) {
      SecurityContextHolder.clearContext();
      unauthorized(response, "Token is invalid or expired");
    }
  }

  private void unauthorized(HttpServletResponse response, String message) throws IOException {
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.setContentType("application/json");
    response.getWriter().write("{\"message\":\"" + message + "\"}");
  }
}
