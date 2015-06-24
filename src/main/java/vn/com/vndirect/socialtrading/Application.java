package vn.com.vndirect.socialtrading;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import vn.com.vndirect.ors.client.api.OrderService;
import vn.com.vndirect.ors.client.api.OrderServiceImpl;


@SpringBootApplication
@EnableScheduling
public class Application {
    @Bean
    public OrderService orderService() {
        return OrderServiceImpl.getInstances();
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}