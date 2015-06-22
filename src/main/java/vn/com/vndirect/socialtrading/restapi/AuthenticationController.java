package vn.com.vndirect.socialtrading.restapi;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.com.vndirect.socialtrading.dao.AccountDao;
import vn.com.vndirect.socialtrading.dao.FollowerDao;
import vn.com.vndirect.socialtrading.dao.TraderDao;
import vn.com.vndirect.socialtrading.model.Account;
import vn.com.vndirect.socialtrading.service.AuthenticationService;

import javax.servlet.http.HttpSession;
import java.util.Optional;

@RestController
public class AuthenticationController {
    private HttpSession session;
    private AuthenticationService as;
    private FollowerDao followerDao;
    private AccountDao accountDao;
    private TraderDao traderDao;


    @Autowired
    public AuthenticationController(HttpSession session,
                                    AuthenticationService as,
                                    FollowerDao followerDao,
                                    AccountDao accountDao,
                                    TraderDao traderDao) {
        this.session = session;
        this.as = as;
        this.followerDao = followerDao;
        this.accountDao = accountDao;
        this.traderDao = traderDao;
    }

    @RequestMapping(value = "/api/v1/login", method = RequestMethod.GET)
    public ResponseEntity<Account> loginInfo() {

        Account account = (Account) session.getAttribute("user");
        if (account == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>(account, HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/api/v1/login", method = RequestMethod.POST)
    public String login(@RequestParam String username,
                        @RequestParam String password) {
        boolean authenticated = as.authenticate(username, password);

        if (authenticated) {
            accountDao.getByUsername(username).ifPresent(account -> {
                if (account.getType() == Account.UserType.FOLLOWER) {
                    account = followerDao.getByUsername(username);
                } else {
                    account = traderDao.getByUsername(username);
                }

                session.setAttribute("user", account);
            });
        }

        // FIXME Throw 401
        return authenticated ? "Yes!" : "nope";
    }
}
