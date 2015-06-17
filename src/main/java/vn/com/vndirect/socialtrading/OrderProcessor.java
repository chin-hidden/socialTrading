package vn.com.vndirect.socialtrading;

import vn.com.vndirect.socialtrading.model.Order;

import java.util.ArrayList;
import java.util.List;

/**
 * The main logic of the system. Listens to notification queues and reacts appropriately.
 */
public class OrderProcessor {
    /**
     * Clone a order made by a trader according to some business rules.
     */
    public List<Order> cloneOrder(Order original) {
        return new ArrayList<>();
    }
}
