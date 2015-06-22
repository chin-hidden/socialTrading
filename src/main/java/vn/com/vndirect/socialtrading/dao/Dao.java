package vn.com.vndirect.socialtrading.dao;


import org.springframework.dao.DataAccessException;

import java.util.List;
import java.util.Optional;

public interface Dao <Entity, Key> {
    Optional<Entity> getSingle(Key id);
    List<Entity> findAll();
    void insert(Entity e) throws DataAccessException;
    void update(Entity e) throws DataAccessException;

    // Insert or update
    void save(Entity e) throws DataAccessException;
    void delete(Entity e) throws DataAccessException;
}
