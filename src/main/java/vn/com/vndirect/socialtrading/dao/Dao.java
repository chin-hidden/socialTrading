package vn.com.vndirect.socialtrading.dao;


import java.util.List;
import java.util.Optional;

public interface Dao <Entity, Key> {
    Optional<Entity> getSingle(Key id);
    List<Entity> findAll();
    boolean insert(Entity e);
    boolean update(Entity e);

    // Insert or update
    boolean save(Entity e);
    boolean delete(Entity e);
}
