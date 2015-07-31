
--
-- Initial test data
--


INSERT INTO account (accountNumber, username, password, name, cash, type) VALUES
       ('0001210254', 'user1', 'user1', 'Đỗ Quốc Huy', 10000, 'FOLLOWER'),
       ('0001210287', 'user2', 'user2', 'Trần Xuân Anh', 15000, 'FOLLOWER'),
       ('0001041716', 'user3', 'user3', 'Trần Nguyên Đán', 45, 'TRADER'),
       ('0001052458', 'user4', 'user4', 'iiii', 5656, 'TRADER'),
       ('0001011079', 'user5', 'user5', 'uuu', 4544, 'TRADER'),
       ('0001029605', 'user6', 'user6', 'Trần Nguyên Đức', 323, 'TRADER');

INSERT INTO followerInfo (username, riskFactor) VALUES
       ('user1', 60),
       ('user2', 40);

INSERT INTO traderInfo (username) VALUES
	('user3'),
	('user4'),
	('user5'),
	('user6');

INSERT INTO following (follower, trader, allocatedMoney) VALUES
	('user1', 'user3', 100000000),
	('user2', 'user3', 20000000);

INSERT INTO orderList VALUES
	('ORDER_123123', 'user1', 'user3', 'VND', 12323, 3434, now(), 'NB', 'MP', 0, 0);

INSERT INTO stockrisk (stock, risk, name, floor) VALUES
	('FPT', 30, 'Tập đoàn FPT', 10),
	('AAA', 60, 'Công ty nhựa An Phát', 02),
	('KLS', 34, 'Chứng khoán Kim Long', 02),
	('MSN', 15, 'Tập đoàn Masan', 10),
	('REE', 35, 'CTCP cơ điện lạnh', 10),
	('SAM', 35, 'CTCP Cáp Savico', 10),
	('VIC', 20, 'Tập đoàn Vin Group', 10),
	('VNM', 20, 'Sữa Vinamilk', 10),
	('VND', 30, 'Chứng khoán Vndirect', 02),
	('ACB', 28, 'Ngân hàng Á Châu', 02),
	('SSI', 20, 'Chứng khoán SSI', 10),
	('SHS', 50, 'CT chứng khoán SHB', 02),
	('SHB', 40, 'Ngân hàng SHB', 02),
	('POT', 30, 'CTCP thiết bị bưu điện', 02),
	('HQC', 20, 'Địa ốc Hoàng Quân', 10),
	('VHG', 20, 'Cao su Quảng Nam', 10),
	('PSD', 30, 'CT dịch vụ dầu khí', 02),
	('PMC', 30, 'Dược phẩm Pharmedic', 02);
