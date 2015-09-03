INSERT INTO account (account_number, username, password, name, cash, account_type, broker) VALUES
       ('0001234567', 'demo_user', 'password', 'Người sử dụng Demo', 100000000, 'FOLLOWER', '__DEMO__'),
       ('account-trader-01', 'trader01', 'password', 'Xin Một Lần Thua', 4500000, 'TRADER', 'VNDIRECT'),
       ('account-trader-02', 'trader02', 'password', 'Lỗ Là Gì', 4500000, 'TRADER', 'VNDIRECT');

UPDATE account SET initialized = TRUE WHERE username = 'demo_user';

INSERT INTO followerInfo (username, risk_factor) VALUES
       ('demo_user', 50);

INSERT INTO traderInfo (username, description) VALUES
       ('trader01', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis sapien a nisl mollis iaculis.'),
       ('trader02', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis sapien a nisl mollis iaculis.');

INSERT INTO following (follower, trader, allocated_money) VALUES
	('demo_user', 'trader01', 100000000),
	('demo_user', 'trader02', 100000000);


INSERT INTO transaction VALUES
	('first-transaction', 'demo_user', 'trader01', 'VND', 10, 23000, 'now', 'NB', 'MP', 23200, 10, 'Filled'),
	('second-transaction', 'demo_user', 'trader02', 'ACB', 40, 30000, 'now', 'NB', 'MP', 31000, 40, 'Filled');

INSERT INTO deal (buying_order_id, selling_order_id) VALUES
	('first-transaction', NULL),
	('second-transaction', NULL);
