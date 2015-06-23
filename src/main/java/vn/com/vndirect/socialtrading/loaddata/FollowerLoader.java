package vn.com.vndirect.socialtrading.loaddata;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import vn.com.vndirect.socialtrading.dao.FollowerDao;
import vn.com.vndirect.socialtrading.utility.InMemory;

import javax.annotation.PostConstruct;

@Component
public class FollowerLoader {
	@Autowired
	private InMemory memory;
	@Autowired
	private FollowerDao followerDao;

	@PostConstruct
	public void load() throws Exception {
		loadListFollowerToMemory();
	}
	
	private void loadListFollowerToMemory()
			throws Exception {
		memory.put("FOLLOWER", "",followerDao.findAll());
		memory.put("FOLLOWERID", "",followerDao.findAllFollowerId());
	}
}
