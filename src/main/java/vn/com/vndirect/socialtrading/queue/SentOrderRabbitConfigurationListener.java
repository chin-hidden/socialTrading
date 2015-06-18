package vn.com.vndirect.socialtrading.queue;

import java.util.Arrays;

import javax.annotation.PostConstruct;

import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class SentOrderRabbitConfigurationListener extends
		MessageRabbitConfigurationListener {

	@Autowired
	public SentOrderRabbitConfigurationListener(
			@Value("${QUEUE_NAME_SENT}") String queueName,
			@Value("${EXCHANGE_NAME_SENT}") String exchageName) {
		super(queueName, exchageName);
	}

	@PostConstruct
	public void init() {
		super.init();
		setMessageHandler();
	}

	private void setMessageHandler() {
		this.handlersOfMessage = this.eventHandlerFilter.filter(handlers, Arrays.asList("SENT"));
	}

	
	@Bean
	public SimpleMessageListenerContainer sentOrderListenerContainer() {
		return super.createListenerContainer();
	}


}
