package vn.com.vndirect.socialtrading.dao;


import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Service;
import vn.com.vndirect.socialtrading.model.Account;

import java.util.List;
import java.util.Optional;

@Service
public class AccountDao extends AbstractDao<Account, String> {

    public Optional<Account> getByUsername(String username) {
        Account result = null;

        try {
            result = template.queryForObject("SELECT * FROM account WHERE username = ?",
                    new BeanPropertyRowMapper<Account>(Account.class),
                    username);
        } catch (DataAccessException e) {
            e.printStackTrace();
        }

        return Optional.of(result);
    }

    @Override
    public Optional<Account> getSingle(String id) {
        return Optional.empty();
    }

    @Override
    public List<Account> findAll() {
        return null;
    }

    @Override
    public void insert(Account e) {
    }

    @Override
    public void update(Account e) {
        // FIXME Which fields do we want to update?
        template.update("UPDATE account SET name = ?, cash = ?",
                e.getName(), e.getCash());
    }

    @Override
    public void save(Account e) {
    }

    @Override
    public void delete(Account e) {
    }
}
