package vn.com.vndirect.socialtrading.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import vn.com.vndirect.socialtrading.dao.AccountDao;

@Service
public class UserService implements UserDetailsService {
    private AccountDao accountDao;

    @Autowired
    public UserService(AccountDao accountDao) {
        this.accountDao = accountDao;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return accountDao.getByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No such user: " + username + "!"));
    }
}
