-- -*- indent-tabs-mode: t

begin;

-- Since this is a test db script, drop everything then recreate our schema.
drop schema public cascade;
create schema public;


CREATE TABLE account (
	accountNumber text PRIMARY KEY,    -- VNDIRECT's internal account number
	username text NOT NULL,
	password text NOT NULL,
	name text NOT NULL,
	cash numeric(19,2) NOT NULL,        -- The cash on hand
	type char                           -- The account type 0: FOLLOWER | 1: TRADER
);

CREATE TABLE followerInfo (
	accountNumber text PRIMARY KEY REFERENCES account (accountNumber),
	riskFactor integer NOT NULL
);

CREATE TABLE traderInfo (
	accountNumber text PRIMARY KEY REFERENCES account (accountNumber),
	totalAllocatedMoney numeric(19,2) NOT NULL,
	peopleFollowing integer NOT NULL
);


CREATE TABLE cashFlow (
	accountNumber text NOT NULL,
	amount numeric(19, 2) NOT NULL,
	date timestamp with time zone NOT NULL
);


CREATE TABLE following (
	followerAccount text NOT NULL REFERENCES account (accountNumber),
	traderAccount text NOT NULL REFERENCES account (accountNumber),
	allocatedMoney numeric(19,2) NOT NULL,
	PRIMARY KEY (followerAccount, traderAccount)
);


CREATE TABLE orderlist (
	orderId text PRIMARY KEY,
	followerAccount text NOT NULL,
	traderAccount text NOT NULL,
	stock text NOT NULL,
	quantity integer NOT NULL,
	price numeric(19, 2) NOT NULL,
	date timestamp with time zone NOT NULL,
	side integer NOT NULL,
	type text NOT NULL,
	matchPrice numeric(19,2),   -- These two can be NULL,
	matchQuantity integer   -- meaning this order has not been matched yet.
);


CREATE TABLE stockrisk (
	stock text PRIMARY KEY,
	risk integer NOT NULL,
	name text NOT NULL,
	floor text NOT NULL
);


-- The stocks that an account is holding
CREATE TABLE position (
	accountNumber text NOT NULL,
	mimickingAccountNumber text,    -- If this position is held by a trader then this field is NULL
	stock text NOT NULL,
	quantity integer NOT NULL,
	cost numeric(19,2) NOT NULL,
	PRIMARY KEY (accountNumber, stock),
	FOREIGN KEY (accountNumber, mimickingAccountNumber) REFERENCES following (followerAccount, traderAccount)
);


-- Snapshots of an account's financial parameters at different points in time.
-- Used mostly to make charts.
CREATE TABLE performance (
	accountNumber text NOT NULL REFERENCES account (accountNumber),
	equity numeric(19, 2) NOT NULL,
	profit numeric(19, 2) NOT NULL,
	date timestamp with time zone NOT NULL
);


--
-- Initial test data
--


INSERT INTO account (accountNumber, username, password, name, cash, type) VALUES
       ('0001210254', 'user1', 'user1', 'Đỗ Quốc Huy', 10000, 0),
       ('0001210287', 'user2', 'user2', 'Trần Xuân Anh', 15000, 0),
       ('0001041716', 'user3', 'user3', 'aeoaeo', 45, 1),
       ('0001052458', 'user4', 'user4', 'iiii', 5656, 1),
       ('0001011079', 'user5', 'user5', 'uuu', 4544, 1),
       ('0001029605', 'user6', 'user6', 'thtnhh', 323, 1);

INSERT INTO followerInfo (accountNumber, riskFactor) VALUES
       ('0001210254', 60),
       ('0001210287', 40);

INSERT INTO traderInfo (accountNumber, totalAllocatedMoney, peopleFollowing) VALUES
	('0001041716', 12321313, 3943),
	('0001052458', 12321313, 3943),
	('0001011079', 12321313, 3943),
	('0001029605', 12321313, 3943);

INSERT INTO following (followerAccount, traderAccount, allocatedMoney) VALUES
	('0001210287', '0001011079', 34343);

INSERT INTO position VALUES
       ('0001052458', NULL, 'FPT', 100, 3434);


select * from position;

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

commit;
