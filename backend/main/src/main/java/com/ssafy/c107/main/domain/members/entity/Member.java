package com.ssafy.c107.main.domain.members.entity;

import com.ssafy.c107.main.common.entity.BaseEntity;
import com.ssafy.c107.main.domain.order.entity.Order;
import com.ssafy.c107.main.domain.order.entity.OrderList;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


import java.util.List;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Getter
@ToString
@Table(name = "Members")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String password;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String birth;

    @Column(nullable = false)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WithDrawalStatus withDrawalStatus;

    @Enumerated(EnumType.STRING)
    private MemberRole role;

    @Column(nullable = false)
    private String uuid;

    @Column(nullable = false)
    private int range;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Order> orders;

    public void addOrder(Order order) {
        this.orders.add(order);
        if (order.getMember() != this) {
            order.setMember(this);
        }
    }

    @Builder
    public Member(String name, String email, String password,
                  String phoneNumber, String birth, String address, WithDrawalStatus withDrawalStatus,
                  MemberRole role, int range) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.birth = birth;
        this.address = address;
        this.withDrawalStatus = withDrawalStatus;
        this.role = role;
        this.range = range;
    }

    public void updateId(Long id) {
        this.id = id;
    }

    public void updatePassword(String password) {
        this.password = password;
    }

    public void updateAddress(String address) {
        this.address = address;
    }

    public void updateRole(MemberRole role) {
        this.role = role;
    }

    public void updateUUID() {
        this.uuid = UUID.randomUUID().toString();
    }
}
