package vn.com.vndirect.socialtrading.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import vn.com.vndirect.socialtrading.dao.FollowerDao;
import vn.com.vndirect.socialtrading.dao.FollowingDao;
import vn.com.vndirect.socialtrading.model.Follower;
import vn.com.vndirect.socialtrading.model.Following;
import vn.com.vndirect.socialtrading.model.Order;

import java.math.BigDecimal;
import java.util.List;

@Service
public class FollowerService {
    FollowingDao followingDao;
    FollowerDao followerDao;
    private SimpMessagingTemplate template;

    @Autowired
    public FollowerService(FollowingDao followingDao,
                           FollowerDao followerDao,
                           SimpMessagingTemplate template) {
        this.followingDao = followingDao;
        this.followerDao = followerDao;
        this.template = template;
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
    public void followTrader(String followerAccount, String traderAccount, BigDecimal allocatedMoney) {
        Following newRlts = new Following(followerAccount, traderAccount, allocatedMoney);
        followingDao.save(newRlts);
    }

    public void orderExecuted(Order executedOrder) {
        template.convertAndSend("/topic/greetings", executedOrder);
    }
}