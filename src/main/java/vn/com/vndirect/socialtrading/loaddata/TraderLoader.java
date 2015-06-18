package vn.com.vndirect.socialtrading.loaddata;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import vn.com.vndirect.socialtrading.utility.InMemory;

@Component
public class TraderLoader {

	private InMemory memory;

	@Autowired
	public TraderLoader(InMemory memory) {
		this.memory = memory;
	}

	@PostConstruct
	public void load() throws Exception {
		loadListTraderToMemory();
	}

	
	private void loadListTraderToMemory()
			throws Exception {
		 
			//memory.put("MARKET", market.getFloorCode(), market);
		 
	}

	

}
