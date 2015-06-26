package vn.com.vndirect.socialtrading.dao;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import javax.sql.DataSource;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import org.springframework.stereotype.Service;
import vn.com.vndirect.socialtrading.model.Position;

@Service
public class PositionDao extends AbstractDao<Position, String> {
    private String baseQuery = "SELECT * FROM position ";

    @Override
    public Optional<Position> getSingle(String id) {
        throw new UnsupportedOperationException("Not implemented!");
    }

    public Optional<Position> getStockFollow(String followerId, String traderId, String symbol) {
        try {
            return Optional.of(template.queryForObject(
                    baseQuery + " WHERE accountnumber = ? and mimickingaccountnumber=? and stock =?",
                    new BeanPropertyRowMapper<Position>(Position.class),
                    followerId,
                    traderId,
                    symbol));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<Position> findAll() {
    	return null;
    }

    @Override
    public void insert(Position position) {
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
    public void update(Position position) {
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
    public void save(Position e) {
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
    public void delete(Position position) {
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
}