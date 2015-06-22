package vn.com.vndirect.socialtrading.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.com.vndirect.socialtrading.dao.FollowerDao;
import vn.com.vndirect.socialtrading.dao.FollowingDao;
import vn.com.vndirect.socialtrading.model.Follower;
import vn.com.vndirect.socialtrading.model.Following;

import java.math.BigDecimal;
import java.util.List;

@Service
public class FollowerService {
    FollowingDao followingDao;
    FollowerDao followerDao;

    @Autowired
    public FollowerService(FollowingDao followingDao, FollowerDao followerDao) {
        this.followingDao = followingDao;
        this.followerDao = followerDao;
    }

    /**
     * Return the list of traders a follower is following.
     */
    public List<Following> followingTraders(String followerAccount) {
        return followingDao.findByFollower(followerAccount);
    }

    /**
     * Follow a trader. Can also be used to change an existing following relationship.
     */
    public boolean followTrader(String followerAccount, String traderAccount, BigDecimal allocatedMoney) {
        // FIXME Use the FollowingDao to create a new following row
        Following newRlts = new Following(followerAccount, traderAccount, allocatedMoney);
        return followingDao.save(newRlts);
    }
}