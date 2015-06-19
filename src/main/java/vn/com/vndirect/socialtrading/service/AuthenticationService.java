package vn.com.vndirect.socialtrading.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.com.vndirect.socialtrading.dao.AccountDao;
import vn.com.vndirect.socialtrading.model.Account;

import java.util.Optional;

@Service
public class AuthenticationService {
    @Autowired
    AccountDao accountDao;

    public boolean authenticate(String username, String password) {
        return accountDao.getByUsername(username)
                .filter(account -> account.getPassword().equals(password)).isPresent();
    }
}
