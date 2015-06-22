package vn.com.vndirect.socialtrading.loaddata;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import vn.com.vndirect.socialtrading.dao.StockDao;
import vn.com.vndirect.socialtrading.utility.InMemory;
import vn.com.vndirect.socialtrading.utility.MyDataSource;

@Component
public class StockLoader {
	private InMemory memory;
	private MyDataSource myDataSource;
	@Autowired
	public StockLoader(InMemory memory,MyDataSource dataSource) {
		this.memory = memory;
		this.myDataSource = dataSource;
	}

	@PostConstruct
	public void load() throws Exception {
		loadListStockToMemory();
	}

	
	private void loadListStockToMemory()throws Exception {
		StockDao stockrDao = new StockDao(myDataSource);
	     memory.put("STOCK_INFO", "",stockrDao.findAll());
	}
}
