package vn.com.vndirect.socialtrading.websocket.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.mvc.method.annotation.AbstractJsonpResponseBodyAdvice;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import vn.com.vndirect.socialtrading.event.EventHandler;
import vn.com.vndirect.socialtrading.event.EventHandlerApplyFor;
import vn.com.vndirect.socialtrading.event.EventHandlerFilter;
import vn.com.vndirect.socialtrading.websocket.handler.StockWebSocketHandler;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Configuration
@EnableWebMvc
@EnableWebSocket
//@PropertySource("classpath:/config/app.properties")
public class WebConfig extends WebMvcConfigurerAdapter implements WebSocketConfigurer {

	@Autowired
	private ApplicationContext applicationContext;
	
	@Autowired
	private EventHandlerFilter eventHandlerFilter;
	
	@Autowired
	private StockWebSocketHandler stockWebSocketHandler;
	
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {

		registry.addHandler(stockWebSocketHandler, "/realtime").withSockJS();
	}

	@ControllerAdvice
	static class JsonpAdvice extends AbstractJsonpResponseBodyAdvice {
		public JsonpAdvice() {
			super("jsonp");
		}
	}
	
	@Bean
	public List<EventHandler> handlers() {
		List<EventHandler> handlers = new ArrayList<EventHandler>();
		Map<String, Object> map = applicationContext.getBeansWithAnnotation(EventHandlerApplyFor.class);
		map.forEach((key, object) -> {
			handlers.add((EventHandler) object);
		});
		return handlers;
	}

	@Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
       return new PropertySourcesPlaceholderConfigurer();
    }
	
	@Override
	public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
		configurer.enable();
	}

}
