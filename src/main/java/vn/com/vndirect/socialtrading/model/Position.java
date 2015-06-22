package vn.com.vndirect.socialtrading.model;

import java.math.BigDecimal;

public class Position {
	private String 	accountnumber;
	private String   mimickingaccountnumber;
	private String   stock;
	private int   quantity;
	private BigDecimal   cost;
	
	public String getAccountnumber() {
		return accountnumber;
	}
	public void setAccountnumber(String accountnumber) {
		this.accountnumber = accountnumber;
	}
	public String getMimickingaccountnumber() {
		return mimickingaccountnumber;
	}
	public void setMimickingaccountnumber(String mimickingaccountnumber) {
		this.mimickingaccountnumber = mimickingaccountnumber;
	}
	public String getStock() {
		return stock;
	}
	public void setStock(String stock) {
		this.stock = stock;
	}
	public int getQuantity() {
		return quantity;
	}
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	public BigDecimal getCost() {
		return cost;
	}
	public void setCost(BigDecimal cost) {
		this.cost = cost;
	}
	
}
