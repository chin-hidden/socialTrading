-- -*- indent-tabs-mode: t

begin;

-- Since this is a test db script, drop everything then recreate our schema.
drop schema public cascade;
create schema public;


CREATE TABLE account (
	accountNumber text NOT NULL,       -- VNDIRECT's internal account number
	brokerage text,                    -- VNDIRECT, SSI, BAOVIET
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

commit;
