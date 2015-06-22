package vn.com.vndirect.socialtrading.service;

import java.math.BigDecimal;

import org.junit.Test;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;

import vn.com.vndirect.socialtrading.model.ExecutedOrder;


public class ExecutedMessageTest {
	public ConnectionFactory connectionFactory() {
		CachingConnectionFactory connectionFactory = new CachingConnectionFactory("10.26.0.160");
		connectionFactory.setUsername("guest");
		connectionFactory.setPassword("guest");
		connectionFactory.setPort(5672);
		return connectionFactory;
	}

	@Bean
	 public RabbitTemplate rabbitTemplate() {
	  RabbitTemplate template = new RabbitTemplate(connectionFactory());
	  template.setMessageConverter(new Jackson2JsonMessageConverter());
	  template.setExchange("NotiCenter.Exchange.ExecutedOrder");
	  return template;
	 }
	@Test
	public void send() throws InterruptedException {
			
		 for( int i=0;i<1;i++)
		 { 
	      ExecutedOrder executedOrder = new ExecutedOrder();
	 
	      executedOrder.setAccount("0001011079");
	      executedOrder.setOrderId("060815-FIXIN02-5147-0-TEST_CLIENT_44_4-2");
	      executedOrder.setTransactTime("1428291705000");
	      executedOrder.setSide(1);
	      executedOrder.setSymbol("VND");
	      executedOrder.setTradeDate("20150608-11:11:45");
	      executedOrder.setQty(1000);
	      BigDecimal price = new BigDecimal("9000");
	      executedOrder.setPrice(price); 
	      executedOrder.setMatchedQty(1000);
	      executedOrder.setMatchedPrice(new BigDecimal("9000"));
	      executedOrder.setEventName("EXECUTED");
	      
	      rabbitTemplate().convertAndSend(executedOrder);
	      Thread.sleep(20);
	 }
		 
	}
}
