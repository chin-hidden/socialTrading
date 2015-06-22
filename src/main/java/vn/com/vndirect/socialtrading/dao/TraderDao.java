package vn.com.vndirect.socialtrading.dao;


import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import vn.com.vndirect.socialtrading.model.Trader;

public class TraderDao implements Dao<Trader, String> {

    private final JdbcTemplate template;
    private String baseQuery =
            "SELECT * FROM account JOIN traderinfo " +
            "ON account.accountNumber = traderinfo.accountNumber";

    public TraderDao(DataSource source) {
        template = new JdbcTemplate(source);
    }

    @Override
    public Trader getSingle(String id) {
        return template.queryForObject(
                baseQuery + " WHERE account.accountNumber = ?",
                new TraderMapper(), id);
    }

    @Override
    public List<Trader> findAll() {
        return template.query(baseQuery, new TraderMapper());
    }
    
    public List<String> findAllTraderId() {
        return template.query(baseQuery, new TraderIdMapper());
    }
    

    @Override
    public boolean insert(Trader e) {
        return false;
    }

    @Override
    public boolean update(Trader e) {
        return false;
    }

    @Override
    public boolean save(Trader e) {
        return false;
    }

    @Override
    public boolean delete(Trader e) {
        return false;
    }

    private static final class TraderMapper implements RowMapper<Trader> {
        @Override
        public Trader mapRow(ResultSet resultSet, int i) throws SQLException {
        	Trader trader = new Trader();
            trader.setAccountNumber(resultSet.getString("accountnumber"));
            trader.setTotalAllocatedMoney(resultSet.getBigDecimal("totalallocatedmoney"));
            trader.setPeopleFollowing(resultSet.getInt("peoplefollowing"));
            return trader;
        }
    }
    private static final class TraderIdMapper implements RowMapper<String> {
        @Override
        public String mapRow(ResultSet resultSet, int i) throws SQLException {
        	return resultSet.getString("accountnumber");
        }
    }
}