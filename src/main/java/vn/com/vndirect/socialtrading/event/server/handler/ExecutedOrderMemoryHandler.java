package vn.com.vndirect.socialtrading.event.server.handler;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import vn.com.vndirect.ors.client.api.OrderService;
import vn.com.vndirect.ors.client.api.OrderServiceImpl;
import vn.com.vndirect.ors.client.api.entity.Report;
import vn.com.vndirect.ors.client.api.utils.OrderException;
import vn.com.vndirect.socialtrading.dao.FollowerDao;
import vn.com.vndirect.socialtrading.dao.FollowingDao;
import vn.com.vndirect.socialtrading.dao.OrderFollowDao;
import vn.com.vndirect.socialtrading.dao.PositionDao;
import vn.com.vndirect.socialtrading.dao.StockDao;
import vn.com.vndirect.socialtrading.event.EventHandler;
import vn.com.vndirect.socialtrading.event.EventHandlerApplyFor;
import vn.com.vndirect.socialtrading.model.ExecutedOrder;
import vn.com.vndirect.socialtrading.model.Follower;
import vn.com.vndirect.socialtrading.model.Following;
import vn.com.vndirect.socialtrading.model.OrderFollow;
import vn.com.vndirect.socialtrading.model.Position;
import vn.com.vndirect.socialtrading.model.StockInfo;
import vn.com.vndirect.socialtrading.utility.InMemory;
import vn.com.vndirect.socialtrading.utility.MyDataSource;
 
@Component
@EventHandlerApplyFor(priority = 3, values = { "EXECUTED" })
public class ExecutedOrderMemoryHandler implements EventHandler {

	private InMemory memory;
	private MyDataSource myDataSource;
	static int MoneySlot =10000000;
	
	@Autowired
	public ExecutedOrderMemoryHandler(InMemory memory,  MyDataSource dataSource) {
		this.memory = memory;
		this.myDataSource = dataSource;
	}

	@Override
	public void handle(Object source) {
		ExecutedOrder executedOrder = (ExecutedOrder) source;
		String account = executedOrder.getAccount();
		System.out.println("account:"+account+" "+ executedOrder.toString());
		List<String> listOfTraderId  = (List<String>) memory.get("TRADERID","");
		List<String> listOfFollowerId  = (List<String>) memory.get("FOLLOWERID","");
		
		PositionDao positionDao = new PositionDao(myDataSource);
		FollowingDao followingDao= new FollowingDao(myDataSource);
		
		String symbol = executedOrder.getSymbol();
		BigDecimal price = executedOrder.getMatchedPrice();
		int side= executedOrder.getSide();
		
		if(listOfTraderId.contains(account))
		{
			//chi sinh lenh copy khi lenh cua trader khop toan bo 
			if(executedOrder.getMatchedQty() == executedOrder.getQty())
			{
				 OrderService orderService = OrderServiceImpl.getInstances();
				 Map<String, List<String>> mapOfTrader = (Map<String, List<String>>) memory.get("MapOfTrader","");
				 List<String> followerIdList = mapOfTrader.get(account);
				 FollowerDao followerDao = new FollowerDao(myDataSource);
				 StockDao stockDao = new StockDao(myDataSource);
				 StockInfo stockInfo= stockDao.getSingle(symbol);
				 Date date = new Date();
				 
				 for(String follower :followerIdList){
					 //check dk co mua/ ban duoc theo khong
					 Follower currentFollower = followerDao.getSingle(follower);
					 //if risk of follower < stock's risk then ignore   
					 if(currentFollower.getRiskFactor()< stockInfo.getRisk()) continue;
					
					 //lenh mua ma da mua het so tien allocate thi bo qua
					 Following myFollowing= followingDao.getSingleFollowing(follower, account);
					 
					 BigDecimal totalCashUsed = positionDao.getCurentCashFollowing(follower, account);
						
					 if(totalCashUsed!=null && (myFollowing.getAllocatedMoney().doubleValue() - totalCashUsed.doubleValue()< MoneySlot) ) continue;
					 
					 //if sell order and follower do not have stock to follow
					 if(side==2){
						 Position position = positionDao.getStockFollow(follower, account, symbol);
						 if(position.getQuantity()< 0) continue;
						 else
						 {
							Report report;
							try {
								report = orderService.executePlaceOrder(follower,"NS", "MP",symbol, price.doubleValue(), position.getQuantity());
								String order_id_return = report.getMessage();
								System.out.println("Print sell order id: "+ order_id_return);
								System.out.println("Print report.getStatus(): "	+ report.getStatus());
								if(report.getStatus()){
									OrderFollowDao orderDao = new OrderFollowDao(myDataSource);
									OrderFollow myOrder = new OrderFollow();
									myOrder.setOrderId(order_id_return);
									myOrder.setAccount(follower);
									myOrder.setTraderAccount(account);
									myOrder.setSymbol(symbol);
									myOrder.setPrice(price);
									myOrder.setQty(position.getQuantity());
									myOrder.setSide(2);
									myOrder.setType(1);
									myOrder.setTradeDate(date.toString());
									myOrder.setMatchedPrice(new BigDecimal("0"));
									myOrder.setMatchedQty(0);

									orderDao.insert(myOrder);
								}
								 
							} catch (OrderException e) {
								e.printStackTrace();
							}
						 }
					 }
					 else{
						// ok thi dat lenh mua theo voi kl la 10trieu/gia stock
						int quantity = MoneySlot / price.intValueExact();
						quantity = quantity - quantity % 100;
						try {
							Report report = orderService.executePlaceOrder(follower,"NB", "MP",symbol, price.doubleValue(), quantity);
							String order_id_return = report.getMessage();
							System.out.println("Print buy order id: "+ order_id_return);
							System.out.println("Print report.getStatus(): "	+ report.getStatus());
							if(report.getStatus()){
								OrderFollowDao orderDao = new OrderFollowDao(myDataSource);
								OrderFollow myOrder = new OrderFollow();
								myOrder.setOrderId(order_id_return);
								myOrder.setAccount(follower);
								myOrder.setTraderAccount(account);
								myOrder.setSymbol(symbol);
								myOrder.setPrice(price);
								myOrder.setQty(quantity);
								myOrder.setSide(1);
								myOrder.setType(1);
								myOrder.setTradeDate(date.toString());
								myOrder.setMatchedPrice(new BigDecimal("0"));
								myOrder.setMatchedQty(0);

								orderDao.insert(myOrder);
							}

						} catch (OrderException e) {
							e.printStackTrace();
						}
					 }
				 }
			}
		}
		else if (listOfFollowerId.contains(account)) //lenh khop cua follower 
		{
			OrderFollowDao orderFollowDao = new OrderFollowDao(myDataSource);
			OrderFollow myOrder = orderFollowDao.getSingle(executedOrder.getOrderId());
			if(myOrder!= null ){
				myOrder.setMatchedQty(myOrder.getMatchedQty()+executedOrder.getQty() );
				double newPrice =  (myOrder.getMatchedQty()* myOrder.getMatchedPrice().doubleValue() + executedOrder.getQty()*executedOrder.getMatchedQty())/(executedOrder.getQty()+myOrder.getMatchedQty());
				myOrder.setMatchedPrice( new BigDecimal(newPrice));
				
				orderFollowDao.update(myOrder);
				
				Position myPosition=  positionDao.getStockFollow(account, myOrder.getTraderAccount(), symbol);
				if(myPosition!= null && side==1){
					myPosition.setQuantity(myPosition.getQuantity()+ executedOrder.getQty());
					double newCost = (myPosition.getQuantity()* myPosition.getCost().doubleValue()+ executedOrder.getQty()*executedOrder.getMatchedPrice().doubleValue())/(myPosition.getQuantity()+executedOrder.getQty());
					myPosition.setCost(new BigDecimal(newCost));
					positionDao.update(myPosition);
				}
				if(myPosition!= null && side==2){
					if(myPosition.getQuantity() == executedOrder.getQty())
						positionDao.delete(myPosition);
					else {
					myPosition.setQuantity(myPosition.getQuantity() - executedOrder.getQty());
					positionDao.update(myPosition);
					}
				}
				else //chua co thi insert moi vao DB
				{
					myPosition.setAccountnumber(account);
					myPosition.setMimickingaccountnumber(myOrder.getTraderAccount() );
					myPosition.setStock(symbol);
					myPosition.setQuantity( executedOrder.getQty());
					myPosition.setCost(executedOrder.getMatchedPrice());
					positionDao.insert(myPosition);
				}
			}
		}
	}

}
