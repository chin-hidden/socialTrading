package vn.com.vndirect.socialtrading.model;

import java.util.HashMap;
import java.util.Map;

public class FollowingInfo {
	private String FollowerId;
	private float moneyAllocate;
	private float currentAllocate;
	private Map <String,Integer> mapStockQuantityFollow = new HashMap<String, Integer>();
	
	public String getFollowerId() {
		return FollowerId;
	}
	public void setFollowerId(String followerId) {
		FollowerId = followerId;
	}
	public float getMoneyAllocate() {
		return moneyAllocate;
	}
	public void setMoneyAllocate(float moneyAllocate) {
		this.moneyAllocate = moneyAllocate;
	}
	public float getCurrentAllocate() {
		return currentAllocate;
	}
	public void setCurrentAllocate(float currentAllocate) {
		this.currentAllocate = currentAllocate;
	}
	public Map<String, Integer> getMapStockQuantityFollow() {
		return mapStockQuantityFollow;
	}
	public void setMapStockQuantityFollow(
			Map<String, Integer> mapStockQuantityFollow) {
		this.mapStockQuantityFollow = mapStockQuantityFollow;
	}
	
}
