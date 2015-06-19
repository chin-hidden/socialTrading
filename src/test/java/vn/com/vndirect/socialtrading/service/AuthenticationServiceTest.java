package vn.com.vndirect.socialtrading.service;

import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import vn.com.vndirect.socialtrading.InjectedTestCase;
import vn.com.vndirect.socialtrading.dao.AccountDao;
import vn.com.vndirect.socialtrading.model.Account;

import java.util.Optional;

import static org.junit.Assert.*;

public class AuthenticationServiceTest extends InjectedTestCase {
    @Mock
    AccountDao accountDao;
    @InjectMocks
    AuthenticationService as;

    @Test
    public void testAuthenticateCorrectPassword() throws Exception {
        Account fakeAccount = new Account();
        fakeAccount.setUsername("fakeusername");
        fakeAccount.setPassword("fakepassword");

        Mockito.when(accountDao.getByUsername(fakeAccount.getUsername()))
                .thenReturn(Optional.of(fakeAccount));
        boolean authenticated = as.authenticate(fakeAccount.getUsername(), fakeAccount.getPassword());

        assertTrue(authenticated);
    }

    @Test
    public void testAuthenticateWrongPassword() {
        Account fakeAccount = new Account();
        fakeAccount.setUsername("fakeusername");
        fakeAccount.setPassword("fakepassword");

        Mockito.when(accountDao.getByUsername(fakeAccount.getUsername()))
                .thenReturn(Optional.of(fakeAccount));
        boolean authenticated = as.authenticate(fakeAccount.getUsername(), "wrongpassword");

        assertFalse(authenticated);
    }

    @Test
    public void testAuthenticateNoSuchAccount() {
        Account fakeAccount = new Account();
        fakeAccount.setUsername("fakeusername");
        fakeAccount.setPassword("fakepassword");

        Mockito.when(accountDao.getByUsername(fakeAccount.getUsername()))
                .thenReturn(Optional.empty());

        boolean authenticated = as.authenticate(fakeAccount.getUsername(), "wrongpassword");

        assertFalse(authenticated);
    }
}