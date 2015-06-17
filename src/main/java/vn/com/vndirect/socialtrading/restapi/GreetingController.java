package vn.com.vndirect.socialtrading.restapi;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.com.vndirect.ors.client.api.OrderServiceImpl;
import vn.com.vndirect.ors.client.api.entity.Report;
import vn.com.vndirect.ors.client.api.utils.OrderException;

import java.util.concurrent.atomic.AtomicLong;

@RestController
public class GreetingController {

    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    @RequestMapping("/greeting")
    public Greeting greeting(@RequestParam(value="name", defaultValue="World") String name) throws OrderException {
        System.out.println(OrderServiceImpl.getInstances().getFixStatus());
        Report report = OrderServiceImpl.getInstances().executePlaceOrder("12321321", "NB", "MP", "VND", 123213, 231232);
        System.out.println("Report: " + report.getStatus());
        return new Greeting(counter.incrementAndGet(),
                String.format(template, name));
    }
}