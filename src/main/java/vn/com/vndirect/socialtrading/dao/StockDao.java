package vn.com.vndirect.socialtrading.dao;


import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import vn.com.vndirect.socialtrading.model.StockInfo;

public class StockDao implements Dao<StockInfo, String> {

    private final JdbcTemplate template;
    private String baseQuery = "SELECT * FROM stockrisk ";

    public StockDao(DataSource source) {
        template = new JdbcTemplate(source);
    }

    @Override
    public StockInfo getSingle(String name) {
    	 return template.queryForObject( baseQuery + " WHERE stock = ?",  new StockInfoMapper(), name);
    }

    @Override
    public List<StockInfo> findAll() {
        return template.query(baseQuery, new StockInfoMapper());
    }

    @Override
    public boolean insert(StockInfo e) {
        return false;
    }

    @Override
    public boolean update(StockInfo e) {
        return false;
    }

    @Override
    public boolean save(StockInfo e) {
        return false;
    }

    @Override
    public boolean delete(StockInfo e) {
        return false;
    }

    private static final class StockInfoMapper implements RowMapper<StockInfo> {
        @Override
        public StockInfo mapRow(ResultSet resultSet, int i) throws SQLException {
        	StockInfo stockInfo = new StockInfo();
        	stockInfo.setStock(resultSet.getString("stock"));
        	stockInfo.setRisk(resultSet.getInt("risk"));
        	stockInfo.setName(resultSet.getString("name"));
        	stockInfo.setFloor(resultSet.getInt("floor"));
            return stockInfo;
        }
    }
}