-- -*- indent-tabs-mode: t

begin;

-- Since this is a test db script, drop everything then recreate our schema.
drop schema public cascade;
create schema public;


CREATE TABLE account (
	accountNumber text NOT NULL,    -- VNDIRECT's internal account number
	broker text,                    -- VNDIRECT, SSI, BAOVIET
	username text PRIMARY KEY,
	password text NOT NULL,
	name text NOT NULL,
	cash numeric(19,2) NOT NULL,        -- The cash on hand
	type text                           -- The account FOLLOWER | TRADER
);

CREATE TABLE followerInfo (
	username text PRIMARY KEY REFERENCES account (username),
	riskFactor integer NOT NULL
);

CREATE TABLE traderInfo (
	username text PRIMARY KEY REFERENCES account (username)
);

CREATE TABLE following (
	follower text NOT NULL REFERENCES account (username),
	trader text NOT NULL REFERENCES account (username),
	allocatedMoney numeric(19,2) NOT NULL,
	PRIMARY KEY (follower, trader)
);


CREATE TABLE orderlist (
	orderId text PRIMARY KEY,
	byUser text NOT NULL REFERENCES account (username),
	mimickingUser text REFERENCES account (username),   -- Can be null if this order is made by a trader
	stock text NOT NULL,
	quantity integer NOT NULL,
	price numeric(19, 2) NOT NULL,
	date timestamp with time zone NOT NULL,
	side text NOT NULL,     -- NS/NB
	type text NOT NULL,     -- MP, LO, etc.
	matchPrice numeric(19,2) NOT NULL,   -- These two can be 0,
	matchQuantity integer NOT NULL       -- meaning this order has not been matched yet.
);


CREATE TABLE stockrisk (
	stock text PRIMARY KEY,
	risk integer NOT NULL,
	name text NOT NULL,
	floor text NOT NULL
);


-- The stocks that an account is holding
CREATE TABLE position (
	username text NOT NULL,
	mimickingUsername text,    -- If this position is held by a trader then this field is NULL
	stock text NOT NULL,
	quantity integer NOT NULL,
	cost numeric(19,2) NOT NULL,
	PRIMARY KEY (username, mimickingUsername, stock),
	FOREIGN KEY (username, mimickingUsername) REFERENCES following (follower, trader)
);



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

INSERT INTO traderInfo (username, totalAllocatedMoney, peopleFollowing) VALUES
	('user3', 0, 0),
	('user4', 0, 0),
	('user5', 100000000, 1),
	('user6', 0, 0);

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

commit;


SELECT traderinfo.totalallocatedmoney AS traderinfo_totalallocatedmoney, traderinfo.peoplefollowing AS traderinfo_peoplefollowing, account.accountnumber AS account_accountnumber, account.type AS account_type, traderinfo.username AS traderinfo_username, account.username AS account_username, account.password AS account_password, account.name AS account_name, account.cash AS account_cash 
FROM following, followerinfo, account JOIN traderinfo ON account.username = traderinfo.username 
WHERE following.follower = 'user1' AND following.trader = followerinfo.username