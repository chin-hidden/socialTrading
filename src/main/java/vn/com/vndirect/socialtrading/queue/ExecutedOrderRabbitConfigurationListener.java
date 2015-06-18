package vn.com.vndirect.socialtrading.queue;

import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Arrays;

@Component
public class ExecutedOrderRabbitConfigurationListener extends
		MessageRabbitConfigurationListener {

	@Autowired
	public ExecutedOrderRabbitConfigurationListener(
			@Value("${QUEUE_NAME_EXECUTED}") String queueName,
			@Value("${EXCHANGE_NAME_EXECUTED}") String exchangeName) {
		super(queueName, exchangeName);
	}

	@PostConstruct
	public void init() {
		super.init();
		setMessageHandler();
	}

	private void setMessageHandler() {
		this.handlersOfMessage = this.eventHandlerFilter.filter(handlers, Arrays.asList("EXECUTED"));
	}

	
	@Bean
	public SimpleMessageListenerContainer executedOrderListenerContainer() {
		return super.createListenerContainer();
	}


}
