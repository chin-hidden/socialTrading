package vn.com.vndirect.socialtrading.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;


public class Trader extends Account {
    private BigDecimal totalAllocatedMoney;
    private int peopleFollowing;

    public int getPeopleFollowing() {
        return peopleFollowing;
    }

    public void setPeopleFollowing(int peopleFollowing) {
        this.peopleFollowing = peopleFollowing;
    }

    public BigDecimal getTotalAllocatedMoney() {
        return totalAllocatedMoney;
    }

    public void setTotalAllocatedMoney(BigDecimal totalAllocatedMoney) {
        this.totalAllocatedMoney = totalAllocatedMoney;
    }
}
