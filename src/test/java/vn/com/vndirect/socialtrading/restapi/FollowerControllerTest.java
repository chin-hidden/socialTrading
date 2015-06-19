package vn.com.vndirect.socialtrading.restapi;

import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import vn.com.vndirect.socialtrading.InjectedTestCase;
import vn.com.vndirect.socialtrading.dao.FollowerDao;
import vn.com.vndirect.socialtrading.model.Follower;
import vn.com.vndirect.socialtrading.model.Trader;
import vn.com.vndirect.socialtrading.service.FollowerService;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.Assert.*;

public class FollowerControllerTest extends InjectedTestCase {
    @Mock
    FollowerDao followerDao;
    @Mock
    FollowerService followerService;

    @InjectMocks
    FollowerController fc;

    @Test
    public void testGetFollower() throws Exception {
        Follower f = new Follower();
        f.setAccountNumber("1234");
        f.setName("lol");
        f.setRiskFactor(123);
        f.setPassword("theoutnoh");
        f.setUsername("abc");

        Mockito.when(followerDao.getSingle(f.getAccountNumber())).thenReturn(Optional.of(f));

        Follower result = fc.getFollower(f.getAccountNumber());
        assertEquals(result, f);
    }

    @Test
    public void testGetFollowerNoSuchFollower() {
        String accountNumber = "1234";
        Mockito.when(followerDao.getSingle(accountNumber)).thenReturn(Optional.empty());

        try {
            fc.getFollower(accountNumber);
            fail();
        } catch (NoSuchElementException e) {
            // It should throw an exception here
        }
    }

    @Test
    public void testGetAllFollowers() throws Exception {
        // No follower
        Mockito.when(followerDao.findAll()).thenReturn(new ArrayList<>());
        List<Follower> result = fc.getAllFollowers();
        assertEquals(result.size(), 0);

        // One follower
        List<Follower> allFollowers = new ArrayList<>();
        allFollowers.add(new Follower());
        Mockito.when(followerDao.findAll()).thenReturn(allFollowers);
        result = fc.getAllFollowers();
        assertEquals(result.size(), 1);
    }

    @Test
    public void testFollowTrader() throws Exception {
        Follower potentialFollower = new Follower();
        Trader potentialTrader = new Trader();
        BigDecimal amount = new BigDecimal(123);

        fc.followTrader(potentialFollower.getAccountNumber(),
                potentialTrader.getAccountNumber(),
                amount);

        // Verify that the followerService is called properly
        Mockito.verify(followerService)
                .followTrader(potentialFollower.getAccountNumber(),
                        potentialTrader.getAccountNumber(),
                        amount);
    }
}