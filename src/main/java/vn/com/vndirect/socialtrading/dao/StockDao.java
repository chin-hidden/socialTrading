package vn.com.vndirect.socialtrading.dao;


import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import vn.com.vndirect.socialtrading.model.StockInfo;

import javax.sql.DataSource;
import java.util.List;
import java.util.Optional;

@Service
public class StockDao extends AbstractDao<StockInfo, String> {

    private String baseQuery = "SELECT * FROM stockrisk ";

    @Override
    public Optional<StockInfo> getSingle(String name) {
    	 return Optional.of(template.queryForObject(baseQuery + " WHERE stock = ?",
                 new BeanPropertyRowMapper<StockInfo>(StockInfo.class),
                 name));
    }

    @Override
    public List<StockInfo> findAll() {
        return template.query(baseQuery, new BeanPropertyRowMapper<StockInfo>(StockInfo.class));
    }

    @Override
    public void insert(StockInfo e) {
    }

    @Override
    public void update(StockInfo e) {
    }

    @Override
    public void save(StockInfo e) {
    }

    @Override
    public void delete(StockInfo e) {
    }
}