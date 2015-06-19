package vn.com.vndirect.socialtrading.restapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import vn.com.vndirect.socialtrading.dao.FollowerDao;
import vn.com.vndirect.socialtrading.model.Account;

import javax.servlet.http.HttpSession;
import java.util.HashMap;


@RestController
public class MeController {
    HttpSession session;

    @Autowired
    public MeController(HttpSession session) {
        this.session = session;
    }

    @RequestMapping(value = "/api/v1/me", method = RequestMethod.GET)
    public HashMap<String, Object> getAccountInfo() {
        Account user = (Account) session.getAttribute("user");
        if (user == null) {
            throw new RuntimeException("No such user");
        }

        HashMap<String, Object> result = new HashMap<>();
        result.put("type", user.getType());
        result.put("accountNumber", user.getAccountNumber());

        return result;
    }
}
