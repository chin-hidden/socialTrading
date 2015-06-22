package vn.com.vndirect.socialtrading.restapi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import vn.com.vndirect.socialtrading.dao.TraderDao;
import vn.com.vndirect.socialtrading.model.Trader;

import java.util.List;

@RestController
public class TraderController {
    TraderDao traderDao;

    @Autowired
    public TraderController(TraderDao traderDao) {
        this.traderDao = traderDao;
    }

    @RequestMapping(value = "/api/v1/traders", method = RequestMethod.GET)
    public List<Trader> allTraders() {
        return traderDao.findAll();
    }
}
