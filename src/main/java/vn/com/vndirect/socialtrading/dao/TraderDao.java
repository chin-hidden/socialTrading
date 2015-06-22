package vn.com.vndirect.socialtrading.dao;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Service;
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
    public void insert(Trader e) {
    }

    @Override
    public void update(Trader e) {
    }

    @Override
    public void save(Trader e) {
    }

    @Override
    public void delete(Trader e) {
    }

    public Optional<Trader> getByUsername(String username) {
        return null;
    }
}
