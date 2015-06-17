package vn.com.vndirect.socialtrading.dao;


import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import vn.com.vndirect.socialtrading.model.Follower;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class FollowerDao implements Dao<Follower, String> {

    private final JdbcTemplate template;
    private String baseQuery =
            "SELECT * FROM account JOIN traderInfo " +
            "ON account.accountNumber = traderInfo.accountNumber";

    public FollowerDao(DataSource source) {
        template = new JdbcTemplate(source);
    }

    @Override
    public Follower getSingle(String id) {
        return template.queryForObject(
                baseQuery + " WHERE account.accountNumber = ?",
                new FollowerMapper(), id);
    }

    @Override
    public List<Follower> findAll() {
        return template.query(baseQuery, new FollowerMapper());
    }

    @Override
    public boolean insert(Follower e) {
        return false;
    }

    @Override
    public boolean update(Follower e) {
        return false;
    }

    @Override
    public boolean save(Follower e) {
        return false;
    }

    @Override
    public boolean delete(Follower e) {
        return false;
    }

    private static final class FollowerMapper implements RowMapper<Follower> {
        @Override
        public Follower mapRow(ResultSet resultSet, int i) throws SQLException {
            Follower follower = new Follower();
            follower.setAccountNumber(resultSet.getString(1));
            return follower;
        }
    }
}