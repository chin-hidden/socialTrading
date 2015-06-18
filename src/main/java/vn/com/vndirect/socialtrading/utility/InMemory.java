package vn.com.vndirect.socialtrading.utility;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

@SuppressWarnings("serial")
@Component("inMemory")
public class InMemory implements Serializable {
	
	private Map<InMemoryKey, Object> memory;
	public InMemory() {
		memory = new HashMap<>();
	}
	
	public void put(String type, Object key, Object value) {
		InMemoryKey objKey = new InMemoryKey(type, key);
		memory.put(objKey, value);
	}
	
	public Object get(String type, Object key) {
		InMemoryKey objKey = new InMemoryKey(type, key);
		
		return memory.get(objKey);
	}

	public void remove(String type, Object key) {
		InMemoryKey objKey = new InMemoryKey(type, key);
		
		memory.remove(objKey);
	}
	
	public interface Type {
		String ORDER = "ORDER";
	}
	
	public interface Gateway{
		String SOCKET_CLIENT_LIST = "SocketClientList";
		String SEQUENCE = "sequence";
		String LAST_PROGRESSED_SEQUENCE = "";
	}
}
