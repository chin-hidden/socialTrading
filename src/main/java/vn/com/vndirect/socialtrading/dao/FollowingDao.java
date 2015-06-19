package vn.com.vndirect.socialtrading.dao;

import org.javatuples.Pair;
import org.springframework.stereotype.Service;
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

    public List<Following> findByTrader(Trader t) {
        return null;
    }

    @Override
    public boolean insert(Following e) {
        return false;
    }

    @Override
    public boolean update(Following e) {
        return false;
    }

    @Override
    public boolean save(Following e) {
        return false;
    }

    @Override
    public boolean delete(Following e) {
        return false;
    }
}
