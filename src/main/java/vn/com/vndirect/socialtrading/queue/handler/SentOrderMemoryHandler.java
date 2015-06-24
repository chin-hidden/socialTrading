package vn.com.vndirect.socialtrading.queue.handler;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import vn.com.vndirect.socialtrading.model.Order;

import java.io.IOException;

@Component
public class SentOrderMemoryHandler {

	private ObjectMapper mapper;

	@Autowired
	public SentOrderMemoryHandler(ObjectMapper mapper) {
		this.mapper = mapper;
	}

	@RabbitListener(queues = "sentOrderList2")
	public void handle(byte[] payload) throws IOException {
		Order order = mapper.readValue(payload, Order.class);

		System.out.println("Sent Order: " + order.getOrderId());
	}
}
