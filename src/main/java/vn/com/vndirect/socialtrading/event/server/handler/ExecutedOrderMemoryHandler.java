package vn.com.vndirect.socialtrading.event.server.handler;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.javatuples.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import vn.com.vndirect.ors.client.api.OrderService;
import vn.com.vndirect.ors.client.api.OrderServiceImpl;
import vn.com.vndirect.ors.client.api.entity.Report;
import vn.com.vndirect.ors.client.api.utils.OrderException;
import vn.com.vndirect.socialtrading.dao.*;
import vn.com.vndirect.socialtrading.event.EventHandler;
import vn.com.vndirect.socialtrading.event.EventHandlerApplyFor;
import vn.com.vndirect.socialtrading.model.*;
import vn.com.vndirect.socialtrading.utility.InMemory;

@Component
@EventHandlerApplyFor(priority = 3, values = { "EXECUTED" })
public class ExecutedOrderMemoryHandler implements EventHandler {
	private FollowerDao followerDao;
	private StockDao stockDao;
	private PositionDao positionDao;
	private FollowingDao followingDao;
	private OrderDao orderDao;
	private InMemory memory;
	static int MoneySlot = 10000000;
	
	@Autowired
	public ExecutedOrderMemoryHandler(FollowerDao followerDao,
									  StockDao stockDao,
									  PositionDao positionDao,
									  FollowingDao followingDao,
									  OrderDao orderDao,
									  InMemory memory) {
		this.followerDao = followerDao;
		this.stockDao = stockDao;
		this.positionDao = positionDao;
		this.followingDao = followingDao;
		this.orderDao = orderDao;
		this.memory = memory;
	}

	@Override
	public void handle(Object source) {
		Order executedOrder = (Order) source;
		String account = executedOrder.getByAccount();

		System.out.println("account:" + account + " " + executedOrder.toString());
		List<String> listOfTraderId  = (List<String>) memory.get("TRADERID","");
		List<String> listOfFollowerId  = (List<String>) memory.get("FOLLOWERID","");

		String symbol = executedOrder.getStock();
		BigDecimal price = executedOrder.getMatchPrice();
		Order.OrderSide side = executedOrder.getSide();

		if(listOfTraderId.contains(account))
		{
			//chi sinh lenh copy khi lenh cua trader khop toan bo 
			if(executedOrder.getMatchQuantity() == executedOrder.getQuantity())
			{
				 OrderService orderService = OrderServiceImpl.getInstances();
				 Map<String, List<String>> mapOfTrader = (Map<String, List<String>>) memory.get("MapOfTrader","");
				 List<String> followerIdList = mapOfTrader.get(account);

				// FIXME Check empty Optional
				 StockInfo stockInfo= stockDao.getSingle(symbol).get();
				 Date date = new Date();
				 
				 for(String follower :followerIdList){
					 //check dk co mua/ ban duoc theo khong
					 // FIXME Check empty Optional
					 Follower currentFollower = followerDao.getSingle(follower).get();
					 //if risk of follower < stock's risk then ignore   
					 if(currentFollower.getRiskFactor()< stockInfo.getRisk()) continue;
					
					 //lenh mua ma da mua het so tien allocate thi bo qua
					 // FIXME Check empty Optional
					 Following myFollowing = followingDao.getSingle(Pair.with(follower, account)).get();
					 
					 BigDecimal totalCashUsed = positionDao.getCurentCashFollowing(follower, account);
						
					 if(totalCashUsed!=null && (myFollowing.getAllocatedMoney().doubleValue() - totalCashUsed.doubleValue()< MoneySlot) ) continue;
					 
					 //if sell order and follower do not have stock to follow
					 if(side == Order.OrderSide.NS){
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
									Order myOrder = new Order();
									myOrder.setOrderId(order_id_return);
									myOrder.setByAccount(follower);
									myOrder.setMimickingAccount(account);
									myOrder.setStock(symbol);
									myOrder.setPrice(price);
									myOrder.setQuantity(position.getQuantity());
									myOrder.setSide(side);
									myOrder.setType(Order.OrderType.MP);
									myOrder.setDate(date);
									myOrder.setMatchPrice(new BigDecimal("0"));
									myOrder.setMatchQuantity(0);

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
								Order myOrder = new Order();
								myOrder.setOrderId(order_id_return);
								myOrder.setByAccount(follower);
								myOrder.setMimickingAccount(account);
								myOrder.setStock(symbol);
								myOrder.setPrice(price);
								myOrder.setQuantity(quantity);
								myOrder.setSide(executedOrder.getSide());
								myOrder.setType(executedOrder.getType());
								myOrder.setDate(date);
								myOrder.setMatchPrice(new BigDecimal("0"));
								myOrder.setMatchQuantity(0);

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
			// FIXME Check empty Optional
			Order myOrder = orderDao.getSingle(executedOrder.getOrderId()).get();

			if (myOrder!= null) {
				myOrder.setMatchQuantity(myOrder.getMatchQuantity() + executedOrder.getQuantity());

				// FIXME Break this down
				double newPrice = (myOrder.getMatchQuantity() * myOrder.getMatchPrice().doubleValue()
						+ executedOrder.getQuantity() * executedOrder.getMatchQuantity())
						/ (executedOrder.getQuantity() + myOrder.getMatchQuantity());

				myOrder.setMatchPrice(new BigDecimal(newPrice));
				orderDao.update(myOrder);
				
				Position myPosition = positionDao.getStockFollow(account, myOrder.getByAccount(), symbol);
				if (myPosition != null && side == Order.OrderSide.NS) {
					myPosition.setQuantity(myPosition.getQuantity() + executedOrder.getQuantity());
					double newCost = (myPosition.getQuantity() * myPosition.getCost().doubleValue()
							+ executedOrder.getQuantity() * executedOrder.getMatchPrice().doubleValue())
							/ (myPosition.getQuantity() + executedOrder.getQuantity());
					myPosition.setCost(new BigDecimal(newCost));
					positionDao.update(myPosition);
				}

				if(myPosition!= null && side == Order.OrderSide.NB){
					if(myPosition.getQuantity() == executedOrder.getQuantity())
						positionDao.delete(myPosition);
					else {
						myPosition.setQuantity(myPosition.getQuantity() - executedOrder.getQuantity());
						positionDao.update(myPosition);
					}
				} else  {
					// chua co thi insert moi vao DB
					myPosition.setAccountnumber(account);
					myPosition.setMimickingaccountnumber(myOrder.getMimickingAccount() );
					myPosition.setStock(symbol);
					myPosition.setQuantity( executedOrder.getQuantity());
					myPosition.setCost(executedOrder.getMatchPrice());
					positionDao.insert(myPosition);
				}
			}
		}
	}

}
