package vn.com.vndirect.socialtrading.model;

import java.math.BigDecimal;

/**
 * A following relationship between a follower and a trader
 */
public class Following {
    private String followerAccount;
    private String traderAccount;
    private BigDecimal allocatedMoney;

    public Following() {}

    public Following(String followerAccount, String traderAccount, BigDecimal allocatedMoney) {
        this.allocatedMoney = allocatedMoney;
        this.traderAccount = traderAccount;
        this.followerAccount = followerAccount;
    }

    public BigDecimal getAllocatedMoney() {
        return allocatedMoney;
    }

    public void setAllocatedMoney(BigDecimal allocatedMoney) {
        this.allocatedMoney = allocatedMoney;
    }

    public String getTraderAccount() {
        return traderAccount;
    }

    public void setTraderAccount(String traderAccount) {
        this.traderAccount = traderAccount;
    }

    public String getFollowerAccount() {
        return followerAccount;
    }

    public void setFollowerAccount(String followerAccount) {
        this.followerAccount = followerAccount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Following following = (Following) o;

        if (!followerAccount.equals(following.followerAccount)) return false;
        if (!traderAccount.equals(following.traderAccount)) return false;
        return allocatedMoney.equals(following.allocatedMoney);

    }

    @Override
    public int hashCode() {
        int result = followerAccount.hashCode();
        result = 31 * result + traderAccount.hashCode();
        result = 31 * result + allocatedMoney.hashCode();
        return result;
    }
}
