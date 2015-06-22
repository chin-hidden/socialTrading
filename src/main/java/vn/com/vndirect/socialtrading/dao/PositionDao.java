package vn.com.vndirect.socialtrading.dao;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import vn.com.vndirect.socialtrading.model.Position;

public class PositionDao implements Dao<Position, String> {

    private final JdbcTemplate template;
    private String baseQuery = "SELECT * FROM position ";

    public PositionDao(DataSource source) {
        template = new JdbcTemplate(source);
    }

    @Override
	public Position getSingle(String id) {
		// TODO Auto-generated method stub
		return null;
	}

    public Position getStockFollow(String followerId, String traderId, String symbol) {
        return template.queryForObject(
                baseQuery + " WHERE accountnumber = ? and mimickingaccountnumber=? and stock =?",
                new PositionMapper (), followerId,traderId,symbol);
    }

    @Override
    public List<Position> findAll() {
    	return null;
    }

    @Override
    public boolean insert(Position position) {
    	String sql = "INSERT INTO position(accountnumber, mimickingaccountnumber, stock, quantity, cost)"+" VALUES (?,?,?,?,?)";
		Connection conn = null;
 
		try {
			conn = template.getDataSource().getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setString(1, position.getAccountnumber());
			ps.setString(2, position.getMimickingaccountnumber());
			ps.setString(3, position.getStock());
			ps.setInt(4, position.getQuantity());
			ps.setBigDecimal(5, position.getCost());
			
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
    public boolean update(Position position) {
    	String sql = "update position set quantity=?, cost=? where accountnumber=? and mimickingaccountnumber =? and stock=?";
		Connection conn = null;
 
		try {
			conn = template.getDataSource().getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, position.getQuantity());
			ps.setBigDecimal(2, position.getCost());
			
			ps.setString(3, position.getAccountnumber());
			ps.setString(4, position.getMimickingaccountnumber());
			ps.setString(5, position.getStock());
			
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
    public boolean save(Position e) {
        return false;
    }
    
    public BigDecimal getCurentCashFollowing(String followerId, String traderId) {
    	String sql = "select accountnumber,mimickingaccountnumber, sum(quantity*cost) totalCost from  position where accountnumber =? and mimickingaccountnumber=? group by accountnumber,mimickingaccountnumber ";
		Connection conn = null;
 
		try {
			conn = template.getDataSource().getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setString(1, followerId);
			ps.setString(2, traderId);
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				BigDecimal totalCost  = rs.getBigDecimal("totalCost");
				return totalCost;
			}
			ps.close();
 
		} catch (SQLException e) {
			throw new RuntimeException(e);
 
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {}
			}
		}
		return null;
    }
    

    @Override
    public boolean delete(Position position) {
    	String sql = "delete position where accountnumber=? and mimickingaccountnumber =? and stock=?";
		Connection conn = null;
 
		try {
			conn = template.getDataSource().getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setString(1, position.getAccountnumber());
			ps.setString(2, position.getMimickingaccountnumber());
			ps.setString(3, position.getStock());
			
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

    private static final class PositionMapper implements RowMapper<Position> {
        @Override
        public Position mapRow(ResultSet resultSet, int i) throws SQLException {
        	Position position = new Position();
            position.setAccountnumber(resultSet.getString("accountnumber"));
            position.setMimickingaccountnumber(resultSet.getString("mimickingaccountnumber"));
            position.setStock(resultSet.getString("stock"));
            position.setCost(resultSet.getBigDecimal("cost"));
            position.setQuantity(resultSet.getInt("quantity"));
            return position;
        }
    }
  	
}