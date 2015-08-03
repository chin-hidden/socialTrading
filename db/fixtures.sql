
--
-- Initial test data
--


INSERT INTO account (account_number, username, password, name, cash, account_type, brokerage) VALUES
       ('0001210254', 'thachvu', 'password', 'Trần Vũ Thạch', 10000, 'FOLLOWER', 'VNDIRECT'),
       ('0001210287', 'linhmai', 'password', 'Bùi Mai Linh', 15000, 'FOLLOWER', 'VNDIRECT'),
       ('0001041716', 'giangnguyen', 'password', 'Nguyễn Hoàng Giang', 45, 'TRADER', 'VNDIRECT'),
       ('0001052458', 'chauhoang', 'password', 'Hoàng Minh Châu', 5656, 'TRADER', 'VNDIRECT'),
       ('0001011079', 'trungngo', 'password', 'Ngô Đức Trung', 4544, 'TRADER', 'VNDIRECT');


INSERT INTO followerInfo (username, risk_factor) VALUES
       ('thachvu', 60),
       ('linhmai', 40);

INSERT INTO traderInfo (username, description) VALUES
	('giangnguyen', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis sapien a nisl mollis iaculis.'),
	('chauhoang', 'Etiam vulputate tristique libero. Vivamus eu lectus non orci rhoncus commodo.'),
	('trungngo', 'Vivamus vestibulum dolor et consequat semper. Nunc ac elit volutpat, ullamcorper magna eu, pharetra diam.');


-- for now, we only allow single following relationship
INSERT INTO following (follower, trader, allocated_money) VALUES
	('thachvu', 'trungngo', 100000000),
	('linhmai', 'giangnguyen', 20000000);


INSERT INTO position (username, mimicking_username, symbol, quantity, buying_price, buying_date) VALUES
	('thachvu', 'trungngo', 'VND', 1000, 15600, now());
