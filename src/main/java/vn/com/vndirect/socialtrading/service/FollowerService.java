package vn.com.vndirect.socialtrading.service;


import vn.com.vndirect.socialtrading.dao.FollowerDao;
import vn.com.vndirect.socialtrading.dao.FollowingDao;
import vn.com.vndirect.socialtrading.model.Follower;
import vn.com.vndirect.socialtrading.model.Following;
import vn.com.vndirect.socialtrading.model.Trader;

import java.math.BigDecimal;
import java.util.List;

public class FollowerService {
    FollowingDao followingDao;
    FollowerDao followerDao;

    public FollowerService(FollowingDao followingDao, FollowerDao followerDao) {
        this.followingDao = followingDao;
        this.followerDao = followerDao;
    }

    /**
     * Return the list of traders a follower is following.
     * @param f
     * @return
     */
    public List<Following> followingTraders(Follower f) {
        return null;
    }

    /**
     * Follow a trader. Can also be used to change an existing following relationship.
     */
    public void followTrader(Follower f, Trader t, BigDecimal allocatedMoney) {
        // FIXME Use the FollowingDao to create a new following row
        Following newRlts = new Following(f.getAccountNumber(), t.getAccountNumber(), allocatedMoney);
        followingDao.save(newRlts);
    }
}