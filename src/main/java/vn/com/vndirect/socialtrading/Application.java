package vn.com.vndirect.socialtrading;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.datasource.AbstractDataSource;
import vn.com.vndirect.socialtrading.dao.FollowerDao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


class MyDataSource extends AbstractDataSource {
    @Override
    public Connection getConnection() throws SQLException {
        return getConnection("postgres", "1111");
    }

    @Override
    public Connection getConnection(String username, String password) throws SQLException {
        return DriverManager.getConnection("jdbc:postgresql://localhost:5432/duber",
                username, password);
    }
}

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        FollowerDao followerDao = new FollowerDao(new MyDataSource());
        System.out.println(followerDao.findAll().size());
    }
}