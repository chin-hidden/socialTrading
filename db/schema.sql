-- -*- indent-tabs-mode: t

begin;

-- Since this is a test db script, drop everything then recreate our schema.
drop schema public cascade;
create schema public;


CREATE TABLE account (
	username text PRIMARY KEY,
	password text NOT NULL,
	account_number text NOT NULL,       -- VNDIRECT's internal account number
	broker text NOT NULL,               -- VNDIRECT, SSI, BAOVIET
	name text NOT NULL,
	cash numeric(19,2) NOT NULL,        -- The cash on hand
	account_type text,                  -- The account FOLLOWER | TRADER
	initialized boolean NOT NULL DEFAULT FALSE
);

CREATE TABLE followerInfo (
	username text PRIMARY KEY REFERENCES account (username),
	risk_factor integer NOT NULL
);

CREATE TABLE traderInfo (
	username text PRIMARY KEY REFERENCES account (username),
	description text NOT NULL  -- FIXME: Should this field hold HTML?
);

CREATE TABLE following (
	follower text NOT NULL REFERENCES account (username),
	trader text NOT NULL REFERENCES account (username),
	allocated_money numeric(19,2) NOT NULL,
	PRIMARY KEY (follower, trader)
);


CREATE TABLE orderlist (
	order_id text PRIMARY KEY,
	by_user text NOT NULL REFERENCES account (username),
	mimicking_user text REFERENCES account (username),   -- Can be null if this order is made by a trader
	symbol text NOT NULL,
	quantity integer NOT NULL,
	price numeric(19, 2) NOT NULL,
	date timestamp with time zone NOT NULL,
	side text NOT NULL,     -- NS/NB
	type text NOT NULL,     -- MP, LO, etc.
	matched_price numeric(19,2) NOT NULL,   -- These two can be 0,
	matched_quantity integer NOT NULL       -- meaning this order has not been matched yet.
);


-- The stocks that an account is holding
CREATE TABLE position (
	username text NOT NULL,
	mimicking_username text NOT NULL,
	symbol text NOT NULL,
	quantity integer NOT NULL,
	buying_price numeric(19,2) NOT NULL,
	buying_date timestamp with time zone NOT NULL,
	PRIMARY KEY (username, mimicking_username, symbol),
	FOREIGN KEY (username, mimicking_username) REFERENCES following (follower, trader)
);

commit;
