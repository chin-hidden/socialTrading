package vn.com.vndirect.socialtrading.dao;


import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import vn.com.vndirect.socialtrading.model.Follower;
import vn.com.vndirect.socialtrading.model.Trader;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class FollowerDao implements Dao<Trader, String> {

    private final JdbcTemplate template;
    private String baseQuery =
            "SELECT * FROM account JOIN traderInfo " +
            "ON account.accountNumber = traderInfo.accountNumber";

    public FollowerDao(DataSource source) {
        template = new JdbcTemplate(source);
    }

    @Override
    public Trader getSingle(String id) {
        return template.queryForObject(
                baseQuery + " WHERE account.accountNumber = ?",
                Trader.class, id);
    }

    @Override
    public List<Trader> findAll() {
        return template.queryForList(baseQuery, Trader.class);
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

    class FollowerMapper implements RowMapper<Follower> {
        @Override
        public Follower mapRow(ResultSet resultSet, int i) throws SQLException {
            Follower follower = new Follower();
            follower.setAccountNumber(resultSet.getString(1));
            return follower;
        }
    }
}