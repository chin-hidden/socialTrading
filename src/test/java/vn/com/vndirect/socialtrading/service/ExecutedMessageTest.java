package vn.com.vndirect.socialtrading.service;

import java.math.BigDecimal;
import java.util.Date;

import org.junit.Test;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;

import vn.com.vndirect.socialtrading.model.Order;


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

        for (int i = 0; i < 1; i++) {
            Order executedOrder = new Order();

            executedOrder.setByAccount("0001011069");
            executedOrder.setOrderId("060815-FIXIN02-5147-0-TEST_CLIENT_44_4-2");
            executedOrder.setSide(Order.OrderSide.NS);
            executedOrder.setStock("VND");
            executedOrder.setDate(new Date(1428291705));
            executedOrder.setQuantity(1000);
            BigDecimal price = new BigDecimal("9000");
            executedOrder.setPrice(price);
            executedOrder.setMatchQuantity(1000);
            executedOrder.setMatchPrice(new BigDecimal("9000"));

            rabbitTemplate().convertAndSend(executedOrder);
            Thread.sleep(20);
        }

    }
}
