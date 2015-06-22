package vn.com.vndirect.socialtrading.loaddata;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import vn.com.vndirect.socialtrading.dao.FollowerDao;
import vn.com.vndirect.socialtrading.utility.InMemory;
import vn.com.vndirect.socialtrading.utility.MyDataSource;

@Component
public class FollowerLoader {
	private InMemory memory;
	private MyDataSource myDataSource;
	
	@Autowired
	public FollowerLoader(InMemory memory,MyDataSource dataSource) {
		this.memory = memory;
		this.myDataSource = dataSource;
	}

	@PostConstruct
	public void load() throws Exception {
		loadListFollowerToMemory();
	}

	
	private void loadListFollowerToMemory()
			throws Exception {
		 FollowerDao followerDao = new FollowerDao(myDataSource);
	     memory.put("FOLLOWER", "",followerDao.findAll());
	     memory.put("FOLLOWERID", "",followerDao.findAllFollowerId());
	}
}
