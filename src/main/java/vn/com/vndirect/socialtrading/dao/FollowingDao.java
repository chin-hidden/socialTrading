package vn.com.vndirect.socialtrading.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.javatuples.Pair;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import vn.com.vndirect.socialtrading.model.Following;
import vn.com.vndirect.socialtrading.model.Trader;


public class FollowingDao implements Dao<Following, Pair<String, String>> {
	 private final JdbcTemplate template;
	 private String baseQuery = "SELECT * FROM following order by traderaccount asc";
	 
	 
	 public FollowingDao(DataSource source) {
	        template = new JdbcTemplate(source);
	    }
    @Override
    public Following getSingle(Pair<String, String> id) {
        return null;
    }

    public Following getSingleFollowing(String followerId, String traderId) {
    	
    	 return template.queryForObject( "SELECT * FROM following where followeraccount=? and traderaccount =?",
                 new FollowingMapper(), followerId,traderId);
    	 
    }
    
    private static final class FollowingMapper implements RowMapper<Following> {
        @Override
        public Following mapRow(ResultSet resultSet, int i) throws SQLException {
        	Following following = new Following();
            following.setFollowerAccount(resultSet.getString("followeraccount"));
            following.setTraderAccount(resultSet.getString("traderaccount"));
            following.setAllocatedMoney(resultSet.getBigDecimal("allocatedmoney"));
            return following;
        }
    }
    
    @Override
    public List<Following> findAll() {
        return null;
    }

    public List<Following> findByTrader(Trader t) {
        return null;
    }
    
    public  Map<String, List<String>> findAllFollowing(){
    	Map<String, List<String >> mapOfTrader =new HashMap<String, List<String>>();
    	
    	List<Map<String, Object>> rows  = template.queryForList(baseQuery);
    	List<String> listOfFollower = new ArrayList<String>();
    	for (Map row : rows) {
    		String traderId = (String) row.get("traderaccount");
			if (!mapOfTrader.containsKey(traderId)) {
				listOfFollower = new ArrayList<String>();
				mapOfTrader.put(traderId, listOfFollower);
			}
			listOfFollower.add((String) row.get("followeraccount"));
    	}
    	return mapOfTrader;
    }
    
/*    public  Map<String, String> findAllFollowingOrder() throws ParseException{
    	
    	DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");
    	Calendar cal = Calendar.getInstance();
    	String curretDate= dateFormat.format(cal.getTime()); 
    	
    	SimpleDateFormat dateFormat1 = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss:SSS");

        Date parsedTimeStamp = dateFormat1.parse(curretDate);

        Timestamp timestamp = new Timestamp(parsedTimeStamp.getTime());

        Map<String,String> mapOfOrder =new HashMap<String, String>();
    	String currentOpenOrder = "SELECT * FROM orderlist where traderaccount!=null and date >"+timestamp+" order by traderaccount asc";
    	List<Map<String, Object>> rows  = template.queryForList(currentOpenOrder);
    	for (Map row : rows) {
			mapOfOrder.put((String) row.get("orderid"),(String) row.get("traderaccount"));
    	}
    	return mapOfOrder;
    }*/
    
    @Override
    public boolean insert(Following e) {
        return false;
    }

    @Override
    public boolean update(Following e) {
        return false;
    }

    @Override
    public boolean save(Following e) {
        return false;
    }

    @Override
    public boolean delete(Following e) {
        return false;
    }
}
