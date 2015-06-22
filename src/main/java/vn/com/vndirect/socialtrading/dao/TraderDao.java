package vn.com.vndirect.socialtrading.dao;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Service;
import vn.com.vndirect.socialtrading.model.Account;
import vn.com.vndirect.socialtrading.model.Trader;

import java.util.List;
import java.util.Optional;


@Service
public class TraderDao extends AbstractDao<Trader, String> {
    @Override
    public Optional<Trader> getSingle(String id) {
        return null;
    }

    @Override
    public List<Trader> findAll() {
        return template.query("SELECT * FROM account " +
                        "JOIN traderInfo " +
                        "ON account.accountNumber = traderInfo.accountNumber",
                new BeanPropertyRowMapper<Trader>(Trader.class));
    }

    @Override
    public boolean insert(Trader e) {
        return false;
    }

    @Override
    public boolean update(Trader e) {
        return false;
    }

    @Override
    public boolean save(Trader e) {
        return false;
    }

    @Override
    public boolean delete(Trader e) {
        return false;
    }

    public Trader getByUsername(String username) {
        return null;
    }
}
