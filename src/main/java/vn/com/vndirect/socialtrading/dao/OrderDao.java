package vn.com.vndirect.socialtrading.dao;


import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import vn.com.vndirect.socialtrading.model.Order;

import javax.sql.DataSource;
import java.util.List;

public class OrderDao implements Dao<Order, String> {
    private JdbcTemplate template;

    public OrderDao(DataSource ds) {
        template = new JdbcTemplate(ds);
    }

    @Override
    public Order getSingle(String id) {
        return null;
    }

    @Override
    public List<Order> findAll() {
        return template.query("SELECT * FROM orderlist", new BeanPropertyRowMapper<Order>(Order.class));
    }

    @Override
    public boolean insert(Order e) {
        return false;
    }

    @Override
    public boolean update(Order e) {
        return false;
    }

    @Override
    public boolean save(Order e) {
        return false;
    }

    @Override
    public boolean delete(Order e) {
        return false;
    }
}
