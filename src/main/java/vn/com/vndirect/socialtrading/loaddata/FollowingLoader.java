package vn.com.vndirect.socialtrading.loaddata;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import vn.com.vndirect.socialtrading.dao.FollowingDao;
import vn.com.vndirect.socialtrading.utility.InMemory;
import vn.com.vndirect.socialtrading.utility.MyDataSource;

@Component
public class FollowingLoader {
	private InMemory memory;
	private MyDataSource myDataSource;
	
	@Autowired
	public FollowingLoader(InMemory memory,MyDataSource dataSource) {
		this.memory = memory;
		this.myDataSource = dataSource;
	}

	@PostConstruct
	public void load() throws Exception {
		loadMapFollowingToMemory();
	}

	
	private void loadMapFollowingToMemory()	throws Exception {
		FollowingDao followingDao = new FollowingDao(myDataSource);
	    memory.put("MapOfTrader", "",followingDao.findAllFollowing());
	    //memory.put("OpenOrderMapping", "", followingDao.findAllFollowingOrder() );
	}
}
