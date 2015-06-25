package vn.com.vndirect.socialtrading.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;


public class Account implements UserDetails {
    public enum UserType {
        FOLLOWER("FOLLOWER"),
        TRADER("TRADER");

        private final String text;

        private UserType(String text) {
            this.text = text;
        }

        @Override
        public String toString() {
            return this.text;
        }
    }

    private String accountNumber;
    private String username;

    @JsonIgnore
    private String password;
    private String name;
    private BigDecimal cash;
    private UserType type;

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getUsername() {
        return username;
    }


    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getCash() {
        return cash;
    }

    public void setCash(BigDecimal cash) {
        this.cash = cash;
    }

    public UserType getType() {
        return type;
    }

    public void setType(UserType type) {
        this.type = type;
    }

    // Implementing UserDetails

    @Override
    public boolean isAccountNonExpired() {
        // FIXME Hardcoded
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // FIXME Hardcoded
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // FIXME Hardcoded
        return true;
    }

    @Override
    public boolean isEnabled() {
        // FIXME Hardcoded
        return true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // FIXME Hardcoded roles
        ArrayList<GrantedAuthority> roles = new ArrayList<>();
        roles.add(() -> "USER");
        return roles;
    }
}
