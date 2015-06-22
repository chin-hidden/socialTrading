package vn.com.vndirect.socialtrading.model;

import java.math.BigDecimal;

public class OrderFollow  extends Order{
	private int type;
	private String traderAccount;
	private int matchedQty;
	private BigDecimal matchedPrice;
	
	
	public String getTraderAccount() {
		return traderAccount;
	}
	public void setTraderAccount(String traderaccount) {
		this.traderAccount = traderaccount;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public int getMatchedQty() {
		return matchedQty;
	}
	public void setMatchedQty(int matchedQty) {
		this.matchedQty = matchedQty;
	}
	public BigDecimal getMatchedPrice() {
		return matchedPrice;
	}
	public void setMatchedPrice(BigDecimal matchedPrice) {
		this.matchedPrice = matchedPrice;
	}
	
}
