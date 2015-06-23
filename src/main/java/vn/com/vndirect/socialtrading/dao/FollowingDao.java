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
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Service;
import vn.com.vndirect.socialtrading.model.Follower;
import vn.com.vndirect.socialtrading.model.Following;
import vn.com.vndirect.socialtrading.model.Trader;

import java.util.List;
import java.util.Optional;


@Service
public class FollowingDao extends AbstractDao<Following, Pair<String, String>> {
    private String baseQuery = "SELECT * FROM following ORDER BY traderaccount ASC";

    @Override
    public Optional<Following> getSingle(Pair<String, String> id) {
    	 return Optional.of(template.queryForObject("SELECT * FROM following " +
                         "WHERE followeraccount = ? AND traderaccount = ?",
                 new BeanPropertyRowMapper<Following>(Following.class),
                 id.getValue0(),
                 id.getValue1()));
    }
    
    @Override
    public List<Following> findAll() {
        return null;
    }

    public List<Following> findByTrader(String traderAccount) {
        return template.query("SELECT * FROM following WHERE traderAccount = ?",
                new BeanPropertyRowMapper<Following>(Following.class),
                traderAccount);
    }

    public List<Following> findByFollower(String followerAccount) {
        return template.query("SELECT * FROM following WHERE followerAccount = ?",
                new BeanPropertyRowMapper<Following>(Following.class),
                followerAccount);
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
    public void insert(Following e) {
    }

    @Override
    public void update(Following e) {
    }

    @Override
    public void save(Following e) {
    }

    @Override
    public void delete(Following e) {
    }
}
