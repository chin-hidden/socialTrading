package vn.com.vndirect.socialtrading.loaddata;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import vn.com.vndirect.socialtrading.utility.InMemory;

@Component
public class StockLoader {
	private InMemory memory;

	@Autowired
	public StockLoader(InMemory memory) {
		this.memory = memory;
	}

	@PostConstruct
	public void load() throws Exception {
		loadListStockToMemory();
	}

	
	private void loadListStockToMemory()
			throws Exception {
		 
			//memory.put("STOCK", market.getFloorCode(), market);
		 
	}
}
