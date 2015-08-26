INSERT INTO account (account_number, username, password, name, cash, account_type, broker) VALUES
       ('0001234567', 'demo_user', 'password', 'Người sử dụng Demo', 100000000, 'FOLLOWER', '__DEMO__'),
       ('0101807860', 'trader01', 'password', 'Xin Một Lần Thua', 4500000, 'TRADER', 'VNDIRECT');

UPDATE account SET initialized = TRUE WHERE username = 'demo_user';

INSERT INTO followerInfo (username, risk_factor) VALUES
       ('demo_user', 50);

INSERT INTO traderInfo (username, description) VALUES
       ('trader01', '');


