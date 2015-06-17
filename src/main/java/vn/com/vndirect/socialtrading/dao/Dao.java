package vn.com.vndirect.socialtrading.dao;


import java.util.List;

public interface Dao <Entity, Key> {
    Entity getSingle(Key id);
    List<Entity> findAll();
    boolean insert(Entity e);
    boolean update(Entity e);

    // Insert or update
    boolean save(Entity e);
    boolean delete(Entity e);
}
