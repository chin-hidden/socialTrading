package vn.com.vndirect.socialtrading.dao;


import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Service;
import vn.com.vndirect.socialtrading.model.Follower;

import java.util.List;
import java.util.Optional;

@Service
public class FollowerDao extends AbstractDao<Follower, String> {

    private String baseQuery =
            "SELECT * FROM account JOIN followerInfo " +
            "ON account.accountNumber = followerInfo.accountNumber";

    @Override
    public Optional<Follower> getSingle(String id) {
        return Optional.of(template.queryForObject(
                baseQuery + " WHERE account.accountNumber = ?",
                new BeanPropertyRowMapper<Follower>(Follower.class), id));
    }

    public Follower getByUsername(String username) {
        return template.queryForObject(
                baseQuery + " WHERE username = ?",
                new BeanPropertyRowMapper<Follower>(Follower.class), username);
    }

    @Override
    public List<Follower> findAll() {
        return template.query(baseQuery,
                new BeanPropertyRowMapper<Follower>(Follower.class));
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
}