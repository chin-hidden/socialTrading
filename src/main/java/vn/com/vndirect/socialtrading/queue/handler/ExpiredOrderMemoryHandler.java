package vn.com.vndirect.socialtrading.queue.handler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import vn.com.vndirect.socialtrading.model.Order;
import vn.com.vndirect.socialtrading.utility.InMemory;
 
@Component
public class ExpiredOrderMemoryHandler {

	private InMemory memory;

	@Autowired
	public ExpiredOrderMemoryHandler(InMemory memory) {
		this.memory = memory;
	}

	public void handle(Object source) {
		Order sentOrder = (Order) source;
		String account = sentOrder.getByAccount();
		System.out.println("account:"+account+" "+ sentOrder.toString());
	}

}
