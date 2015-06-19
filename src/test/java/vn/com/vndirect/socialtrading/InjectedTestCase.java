package vn.com.vndirect.socialtrading;

import org.junit.Before;
import org.mockito.MockitoAnnotations;

public class InjectedTestCase {
    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }
}
