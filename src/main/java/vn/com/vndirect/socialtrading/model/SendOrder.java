package vn.com.vndirect.socialtrading.model;


public class SendOrder extends Order {
	// FIXME Refactor to use enum
    private int type;

    public int getType() {
		return type;
	}
    /*
    		1= MP
    		2= LO
    		3= ATO
    		5= ATC
    		6= MOK
    		7= MAK
    		8= MTL
     */
	public void setType(int type) {
		this.type = type;
	}
	
    @Override
    public String toString() {
        return "Order{" +
                "orderId=" + orderId +   
                ", account='" + account + '\'' +  ", symbol=" + symbol + 
                ", side=" + side +   ", tradeDate=" +  tradeDate+  ", transactTime=" +  transactTime+ ", qty=" + qty + ", price=" + price +
                  ", type=" + type + ", eventName=" + eventName +
                '}';
    }
}
