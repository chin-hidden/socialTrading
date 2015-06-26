package vn.com.vndirect.socialtrading.dao;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Service;
import vn.com.vndirect.socialtrading.model.Follower;

import java.util.List;
import java.util.Optional;

@Service
public class FollowerDao extends AbstractDao<Follower, String> {
    private AccountDao accountDao;

    @Autowired
    public FollowerDao(AccountDao accountDao) {
        this.accountDao = accountDao;
    }

    private String baseQuery =
            "SELECT * FROM account JOIN followerInfo " +
            "ON account.accountNumber = followerInfo.accountNumber";

    @Override
    public Optional<Follower> getSingle(String id) {
        try {
            return Optional.of(template.queryForObject(
                    baseQuery + " WHERE account.accountNumber = ?",
                    new BeanPropertyRowMapper<Follower>(Follower.class), id));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<Follower> getByUsername(String username) {
        try {
            return Optional.of(template.queryForObject(
                    baseQuery + " WHERE username = ?",
                    new BeanPropertyRowMapper<Follower>(Follower.class), username));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<String> findAllFollowerId() {
        return template.queryForList("SELECT accountNumber FROM account WHERE type = 'FOLLOWER'", String.class);
    }
    
    @Override
    public List<Follower> findAll() {
        return template.query(baseQuery,
                new BeanPropertyRowMapper<Follower>(Follower.class));
    }

    @Override
    public void insert(Follower e) {
    }

    @Override
    public void update(Follower e) {
        accountDao.update(e);

        template.update("UPDATE followerInfo SET riskFactor = ? WHERE accountNumber = ?",
                e.getRiskFactor(),
                e.getAccountNumber());
    }

    @Override
    public void save(Follower e) {
    }

    @Override
    public void delete(Follower e) {}
}