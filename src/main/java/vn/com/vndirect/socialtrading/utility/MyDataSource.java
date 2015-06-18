package vn.com.vndirect.socialtrading.utility;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.springframework.jdbc.datasource.AbstractDataSource;
import org.springframework.stereotype.Component;

@Component("myDataSource")
public class MyDataSource extends AbstractDataSource {
    @Override
    public Connection getConnection() throws SQLException {
        return getConnection("postgres", "123456");
    }

    @Override
    public Connection getConnection(String username, String password) throws SQLException {
        return DriverManager.getConnection("jdbc:postgresql://localhost:5432/duber",
                username, password);
    }
}