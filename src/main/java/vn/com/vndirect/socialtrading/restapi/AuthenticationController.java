package vn.com.vndirect.socialtrading.restapi;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.com.vndirect.socialtrading.dao.AccountDao;
import vn.com.vndirect.socialtrading.dao.FollowerDao;
import vn.com.vndirect.socialtrading.model.Account;
import vn.com.vndirect.socialtrading.service.AuthenticationService;

import javax.servlet.http.HttpSession;
import java.util.Optional;

@RestController
public class AuthenticationController {
    @Autowired private HttpSession session;
    @Autowired private AuthenticationService as;
    @Autowired private FollowerDao followerDao;
    @Autowired private AccountDao accountDao;
    //@Autowired private TraderDao traderDao;

    @RequestMapping(value = "/api/v1/login")
    public String login(String username, String password) {
        boolean authenticated = as.authenticate(username, password);

        if (authenticated) {
            accountDao.getByUsername(username).ifPresent(account -> {
                if (account.getType() == Account.UserType.FOLLOWER) {
                    account = followerDao.getByUsername(username);
                } else {
                    //account = traderDao.getByUsername(username));
                }

                session.setAttribute("user", account);
            });
        }

        // FIXME Throw 401
        return authenticated ? "Yes!" : "nope";
    }
}
