package vn.com.vndirect.socialtrading.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.com.vndirect.socialtrading.dao.AccountDao;
import vn.com.vndirect.socialtrading.model.Account;

@Service
public class AuthenticationService {
    @Autowired
    AccountDao accountDao;

    public boolean authenticate(String username, String password) {
        try {
            Account account = accountDao.getByUsername(username);
            if (account.getPassword().equals(password)) {
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
