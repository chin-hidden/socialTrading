package vn.com.vndirect.socialtrading.loaddata;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import vn.com.vndirect.socialtrading.dao.FollowingDao;
import vn.com.vndirect.socialtrading.utility.InMemory;

@Component
public class FollowingLoader {
	private FollowingDao followingDao;
	private InMemory memory;

	@Autowired
	public FollowingLoader(FollowingDao followingDao, InMemory memory) {
		this.followingDao = followingDao;
		this.memory = memory;
	}

	@PostConstruct
	public void load() throws Exception {
		loadMapFollowingToMemory();
	}

	
	private void loadMapFollowingToMemory()	throws Exception {
	    memory.put("MapOfTrader", "", followingDao.findAllFollowing());
	    //memory.put("OpenOrderMapping", "", followingDao.findAllFollowingOrder() );
	}
}
