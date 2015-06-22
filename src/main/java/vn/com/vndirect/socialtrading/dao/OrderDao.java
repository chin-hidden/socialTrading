package vn.com.vndirect.socialtrading.dao;


import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import vn.com.vndirect.socialtrading.model.Order;

import javax.sql.DataSource;
import java.util.List;
import java.util.Optional;

public class OrderDao implements Dao<Order, String> {
    private JdbcTemplate template;

    public OrderDao(DataSource ds) {
        template = new JdbcTemplate(ds);
    }

    @Override
    public Optional<Order> getSingle(String id) {
        return null;
    }

    @Override
    public List<Order> findAll() {
        return template.query("SELECT * FROM orderlist", new BeanPropertyRowMapper<Order>(Order.class));
    }

    @Override
    public void insert(Order e) {
    }

    @Override
    public void update(Order e) {
    }

    @Override
    public void save(Order e) {
    }

    @Override
    public void delete(Order e) {
    }
}
