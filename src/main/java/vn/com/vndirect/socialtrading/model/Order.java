package vn.com.vndirect.socialtrading.model;


import java.math.BigDecimal;
import java.util.Date;

public class Order {
    public enum OrderType {
        ATO("ATO"),
        ATC("ATC"),
        MP("MP"),
        LO("LO"),
        MOK("MOK");

        private final String text;

        private OrderType(String text) {
            this.text = text;
        }

        @Override
        public String toString() {
            return text;
        }
    }

    public enum OrderSide {
        NS("NS"),
        NB("NB");

        private final String text;

        private OrderSide(String text) {
            this.text = text;
        }

        @Override
        public String toString() {
            return text;
        }
    }

    private String orderId;
    private String byAccount;
    private String mimickingAccount;
    private String stock;
    private int quantity;
    private BigDecimal price;
    private Date date;
    private OrderSide side;
    private OrderType type;
    private BigDecimal matchPrice;
    private int matchQuantity;
}
