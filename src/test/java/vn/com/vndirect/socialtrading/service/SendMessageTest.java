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

public class SendMessageTest {
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
        template.setExchange("NotiCenter.Exchange.SentOrder");
        return template;
    }

    @Test
    public void send() throws InterruptedException {
        for (int i = 0; i < 1; i++) {
            Order sentOrder = new Order();
            sentOrder.setByAccount("0001011079");
            sentOrder.setOrderId("006806041500515556");
            sentOrder.setSide(Order.OrderSide.NB);
            sentOrder.setStock("VND");
            sentOrder.setDate(new Date(1428291705));
            sentOrder.setType(Order.OrderType.LO);
            sentOrder.setQuantity(600);
            BigDecimal price = new BigDecimal("13800");
            sentOrder.setPrice(price);

            rabbitTemplate().convertAndSend(sentOrder);
            Thread.sleep(200);
        }
    }
}
