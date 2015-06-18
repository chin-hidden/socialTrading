package vn.com.vndirect.socialtrading.dao;


import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import vn.com.vndirect.socialtrading.model.Follower;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
public class FollowerDao extends AbstractDao<Follower, String> {

    private String baseQuery =
            "SELECT * FROM account JOIN followerInfo " +
            "ON account.accountNumber = followerInfo.accountNumber";

    @Override
    public Follower getSingle(String id) {
        return template.queryForObject(
                baseQuery + " WHERE account.accountNumber = ?",
                new FollowerMapper(), id);
    }

    public Follower getByUsername(String username) {
        return template.queryForObject(
                baseQuery + " WHERE username = ?",
                new FollowerMapper(), username);
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