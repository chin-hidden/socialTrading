package vn.com.vndirect.socialtrading.dao;

import org.javatuples.Pair;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Service;
import vn.com.vndirect.socialtrading.model.Follower;
import vn.com.vndirect.socialtrading.model.Following;
import vn.com.vndirect.socialtrading.model.Trader;

import java.util.List;
import java.util.Optional;


@Service
public class FollowingDao extends AbstractDao<Following, Pair<String, String>> {
    @Override
    public Optional<Following> getSingle(Pair<String, String> id) {
        return null;
    }

    @Override
    public List<Following> findAll() {
        return null;
    }

    public List<Following> findByTrader(String traderAccount) {
        return template.query("SELECT * FROM following WHERE traderAccount = ?",
                new BeanPropertyRowMapper<Following>(Following.class),
                traderAccount);
    }

    public List<Following> findByFollower(String followerAccount) {
        return template.query("SELECT * FROM following WHERE followerAccount = ?",
                new BeanPropertyRowMapper<Following>(Following.class),
                followerAccount);
    }

    @Override
    public void insert(Following e) {
    }

    @Override
    public void update(Following e) {
    }

    @Override
    public void save(Following e) {
    }

    @Override
    public void delete(Following e) {
    }
}
