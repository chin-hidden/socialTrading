package vn.com.vndirect.socialtrading.dao;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Service;
import vn.com.vndirect.socialtrading.model.Trader;

import java.util.List;
import java.util.Optional;


@Service
public class TraderDao extends AbstractDao<Trader, String> {
    private String baseQuery =
            "SELECT * FROM account JOIN traderinfo " +
                    "ON account.accountNumber = traderinfo.accountNumber";

    @Override
    public Optional<Trader> getSingle(String id) {
        return Optional.of(template.queryForObject(
                baseQuery + " WHERE account.accountNumber = ?",
                new BeanPropertyRowMapper<Trader>(Trader.class), id));
    }

    @Override
    public List<Trader> findAll() {
        return template.query(baseQuery,
                new BeanPropertyRowMapper<Trader>(Trader.class));
    }

    public List<String> findAllTraderId() {
        return template.queryForList(
                "SELECT accountNumber FROM account WHERE type = 'TRADER'",
                String.class);
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
        return Optional.of(template.queryForObject(
                "SELECT * FROM account JOIN traderInfo " +
                        "ON account.accountNumber = traderInfo.accountNumber " +
                        "WHERE username = ?",
                new BeanPropertyRowMapper<Trader>(Trader.class),
                username));
    }
}
