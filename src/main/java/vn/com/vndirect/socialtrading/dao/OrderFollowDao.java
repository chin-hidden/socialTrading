package vn.com.vndirect.socialtrading.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import vn.com.vndirect.socialtrading.model.OrderFollow;

public class OrderFollowDao implements Dao<OrderFollow, String> {

    private final JdbcTemplate template;
    private String baseQuery =    "SELECT * FROM orderlist";

    public OrderFollowDao(DataSource source) {
        template = new JdbcTemplate(source);
    }

    @Override
    public OrderFollow getSingle(String id) {
        return template.queryForObject(baseQuery + " WHERE orderid = ?", new OrderFollowMapper(), id);
    }

    @Override
    public List<OrderFollow> findAll() {
        return template.query(baseQuery, new OrderFollowMapper());
    }
  
    @Override
    public boolean insert(OrderFollow orderFollow) {
    	String sql = "INSERT INTO orderlist(orderid, followeraccount, traderaccount, stock, quantity, price, date, side, type, matchprice, matchquantity)"+
    			" VALUES (?,?,?,?,?,?,?,?,?,?,?)";
		Connection conn = null;
 
		try {
			conn = template.getDataSource().getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setString(1, orderFollow.getOrderId());
			ps.setString(2, orderFollow.getAccount());
			ps.setString(3, orderFollow.getTraderAccount());
			ps.setString(4, orderFollow.getSymbol());
			ps.setInt(5, orderFollow.getQty());
			ps.setBigDecimal(6, orderFollow.getPrice());
			ps.setString(7, orderFollow.getTradeDate());//can fix here
			ps.setInt(8, orderFollow.getSide());
			ps.setInt(9, orderFollow.getType());
			ps.setBigDecimal(10, orderFollow.getMatchedPrice());
			ps.setInt(11, orderFollow.getMatchedQty());
			 
			ps.executeUpdate();
			ps.close();
			
			return true;
 
		} catch (SQLException e) {
			throw new RuntimeException(e);
 
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {}
			}
		}
    }

    @Override
    public boolean update(OrderFollow orderFollow) {
    	String sql = "update orderlist set  matchquantity=?, matchprice=? where orderid=?";
		Connection conn = null;
 
		try {
			conn = template.getDataSource().getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, orderFollow.getMatchedQty());
			ps.setBigDecimal(2, orderFollow.getMatchedPrice());
			
			ps.setString(3, orderFollow.getOrderId());
			 
			ps.executeUpdate();
			ps.close();
			
			return true;
 
		} catch (SQLException e) {
			throw new RuntimeException(e);
 
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {}
			}
		}
    }

    @Override
    public boolean save(OrderFollow e) {
        return false;
    }

    @Override
    public boolean delete(OrderFollow e) {
        return false;
    }

    private static final class OrderFollowMapper implements RowMapper<OrderFollow> {
        @Override
        public OrderFollow mapRow(ResultSet resultSet, int i) throws SQLException {
        	OrderFollow orderFollow = new OrderFollow();
        	orderFollow.setOrderId(resultSet.getString("orderid"));
            orderFollow.setAccount(resultSet.getString("followeraccount"));
            orderFollow.setTraderAccount(resultSet.getString("traderaccount"));
            orderFollow.setSymbol(resultSet.getString("stock"));
            orderFollow.setQty(resultSet.getInt("quantity"));
            orderFollow.setPrice(resultSet.getBigDecimal("price"));
            orderFollow.setTradeDate(resultSet.getString("date"));
            orderFollow.setSide(resultSet.getInt("side"));
            orderFollow.setType(resultSet.getInt("type"));
            orderFollow.setMatchedQty(resultSet.getInt("matchquantity"));
            orderFollow.setMatchedPrice(resultSet.getBigDecimal("matchprice"));
            
            return orderFollow;
        }
    }

}