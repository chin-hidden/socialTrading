package vn.com.vndirect.socialtrading.restapi;

import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import vn.com.vndirect.socialtrading.InjectedTestCase;
import vn.com.vndirect.socialtrading.model.Account;

import javax.servlet.http.HttpSession;
import java.util.HashMap;

import static org.junit.Assert.assertEquals;

public class MeControllerTest extends InjectedTestCase {
    @Mock
    HttpSession session;

    @InjectMocks
    MeController meController;

    @Test
    public void testGetFollowerAccountInfo() throws Exception {
        Account fakeAccount = new Account();
        fakeAccount.setAccountNumber("haha");
        fakeAccount.setType(Account.UserType.FOLLOWER);

        Mockito.when(session.getAttribute("user")).thenReturn(fakeAccount);

        HashMap<String, Object> result= meController.getAccountInfo();
        assertEquals(result.get("type"), Account.UserType.FOLLOWER);
        assertEquals(result.get("accountNumber"), fakeAccount.getAccountNumber());
    }

    @Test
    public void testGetTraderAccountInfo() {
        Account fakeAccount = new Account();
        fakeAccount.setAccountNumber("haha");
        fakeAccount.setType(Account.UserType.TRADER);

        Mockito.when(session.getAttribute("user")).thenReturn(fakeAccount);

        HashMap<String, Object> result= meController.getAccountInfo();
        assertEquals(result.get("type"), Account.UserType.TRADER);
        assertEquals(result.get("accountNumber"), fakeAccount.getAccountNumber());
    }
}