package vn.com.vndirect.socialtrading.model;

public class ExecutedOrder extends Order{
	private int matchedQty;
	private int matchedPrice;

	public int getMatchedQty() {
		return matchedQty;
	}
	public void setMatchedQty(int matchedQty) {
		this.matchedQty = matchedQty;
	}
	public int getMatchedPrice() {
		return matchedPrice;
	}
	public void setMatchedPrice(int matchedPrice) {
		this.matchedPrice = matchedPrice;
	}
    @Override
    public String toString() {
        return "Order{" +
                "orderId=" + orderId +   
                ", account='" + account + '\'' +  ", symbol=" + symbol + 
                ", side=" + side +   ", tradeDate=" +  tradeDate+  ", transactTime=" +  transactTime+ ", qty=" + qty + ", price=" + price +
                  ", matchedQty=" + matchedQty+  ", matchedPrice=" +  matchedPrice + ", eventName=" + eventName +'}';
    }
}
