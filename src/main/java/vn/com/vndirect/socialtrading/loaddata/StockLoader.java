package vn.com.vndirect.socialtrading.loaddata;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import vn.com.vndirect.socialtrading.dao.StockDao;
import vn.com.vndirect.socialtrading.utility.InMemory;

@Component
public class StockLoader {
	private InMemory memory;
	private StockDao stockDao;

	@Autowired
	public StockLoader(InMemory memory, StockDao stockDao) {
		this.memory = memory;
		this.stockDao = stockDao;
	}

	@PostConstruct
	public void load() throws Exception {
		loadListStockToMemory();
	}

	
	private void loadListStockToMemory()throws Exception {
	     memory.put("STOCK_INFO", "", stockDao.findAll());
	}
}
