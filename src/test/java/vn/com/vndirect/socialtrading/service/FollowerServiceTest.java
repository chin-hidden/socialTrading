package vn.com.vndirect.socialtrading.service;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import vn.com.vndirect.socialtrading.dao.FollowerDao;
import vn.com.vndirect.socialtrading.dao.FollowingDao;
import vn.com.vndirect.socialtrading.model.Follower;
import vn.com.vndirect.socialtrading.model.Following;
import vn.com.vndirect.socialtrading.model.Trader;

import java.math.BigDecimal;


public class FollowerServiceTest {
    FollowerDao followerDao;
    FollowingDao followingDao;
    FollowerService fs;

    @Before
    public void setup() {
        followerDao = Mockito.mock(FollowerDao.class);
        followingDao = Mockito.mock(FollowingDao.class);
        fs = new FollowerService(followingDao, followerDao);
    }

    @Test
    public void testFollowTrader() throws Exception {
        // Khi follow thì tạo một dòng mới trong bảng following
        Trader aTrader = new Trader();
        Follower aFollower = new Follower();
        BigDecimal amount = new BigDecimal(1234);
        aTrader.setAccountNumber("0012312031023");  // Random numbers
        aFollower.setAccountNumber("0013873579785");

        fs.followTrader(aFollower, aTrader, amount);

        Following newRlts = new Following(aFollower.getAccountNumber(), aTrader.getAccountNumber(), amount);
        Mockito.verify(followingDao).save(newRlts);
    }
}