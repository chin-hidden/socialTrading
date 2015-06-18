package vn.com.vndirect.socialtrading.dao;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public abstract class AbstractDao<Entity, Key> implements Dao<Entity, Key> {
    @Autowired
    protected JdbcTemplate template;
}
