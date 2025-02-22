package com.ssafy.c107.main.domain.review.repository;

import com.ssafy.c107.main.domain.review.entity.Review;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Optional<Review> findByOrderList_Id(Long id);

    @Query("SELECT r FROM Review r " +
        "JOIN FETCH r.orderList ol " +
        "JOIN FETCH ol.order o " +
        "JOIN FETCH o.store s " +
        "WHERE s.id = :storeId "
        + "ORDER BY r.createdAt DESC ")
    List<Review> findAllByStoreId(@Param("storeId") Long storeId);

    @Query("SELECT r FROM Review r " +
        "JOIN FETCH r.orderList ol " +
        "JOIN FETCH ol.order o " +
        "JOIN FETCH ol.food f " +
        "WHERE o.store.id = :storeId " +
        "ORDER BY r.createdAt DESC")
    List<Review> findReviewByStoreId(@Param("storeId") Long storeId);

    @Query("SELECT r FROM Review r " +
        "JOIN FETCH r.orderList ol " +
        "JOIN FETCH ol.order o " +
        "JOIN FETCH ol.food f " +
        "WHERE o.store.id = :storeId " +
        "ORDER BY r.createdAt DESC ")
    Page<Review> findReviewByStoreId(@Param("storeId") Long storeId, Pageable pageable);

    @Query("SELECT COALESCE(COUNT(r),0) "
        + "FROM Review r "
        + "WHERE r.orderList.order.store.id = :storeId ")
    Long countByStoreId(@Param("storeId") Long storeId);

    Page<Review> findAllByOrderList_Food_IdOrderByCreatedAtDesc(Long id, Pageable pageable);

    @Query("SELECT COALESCE(COUNT(r), 0) "
        + "FROM Review r "
        + "WHERE r.orderList.order.store.id = :storeId "
        + "AND r.emotion = :emotion ")
    Long getCount(@Param("storeId") Long storeId, @Param("emotion") boolean emotion);

    @Query("SELECT COALESCE(COUNT(r), 0) "
        + "FROM Review r "
        + "WHERE r.orderList.order.store.id = :storeId "
        + "AND r.emotion = :emotion "
        + "AND r.orderList.food.id = :foodId ")
    Long getCountFood(@Param("storeId") Long storeId, @Param("emotion") boolean emotion,
        @Param("foodId") Long foodId);

    @Query("SELECT COALESCE(COUNT(r), 0) "
        + "FROM Review r "
        + "WHERE r.orderList.food.id = :foodId")
    Long getCountFood(@Param("foodId") Long foodId);

    @Query("SELECT r FROM Review r " +
        "JOIN FETCH r.orderList ol " +
        "JOIN FETCH ol.order o " +
        "JOIN FETCH ol.food f " +
        "WHERE o.store.id = :storeId "
        + "AND f.id = :foodId "
        + "ORDER BY r.createdAt DESC")
    List<Review> findReviewByStoreIdAndFoodId(@Param("storeId") Long storeId,
        @Param("foodId") Long foodId);

    @Query("SELECT r FROM Review r " +
        "JOIN FETCH r.orderList ol " +
        "JOIN FETCH ol.order o " +
        "JOIN FETCH ol.food f " +
        "WHERE o.store.id = :storeId "
        + "AND f.id = :foodId "
        + "ORDER BY r.createdAt DESC")
    Page<Review> findReviewByStoreIdAndFoodId(@Param("storeId") Long storeId,
        @Param("foodId") Long foodId, Pageable pageable);

    @Query("SELECT r FROM Review r JOIN FETCH r.orderList ol JOIN FETCH ol.food f JOIN FETCH ol.order o JOIN FETCH o.store s WHERE s.id = :storeId ORDER BY r.positive DESC")
    List<Review> findTop5PositiveReviewsByStoreId(@Param("storeId") Long storeId, Pageable pageable);

    @Query("SELECT r FROM Review r JOIN FETCH r.orderList ol JOIN FETCH ol.food f JOIN FETCH ol.order o JOIN FETCH o.store s WHERE s.id = :storeId ORDER BY r.negative DESC")
    List<Review> findTop5NegativeReviewsByStoreId(@Param("storeId") Long storeId, Pageable pageable);
}
