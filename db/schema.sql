-- -*- indent-tabs-mode: t

begin;

-- Since this is a test db script, drop everything then recreate our schema.
drop schema public cascade;
create schema public;


CREATE TABLE account (
	username text PRIMARY KEY,
	password text,
	account_number text NOT NULL,       -- VNDIRECT's internal account number
	broker text NOT NULL,               -- VNDIRECT, SSI, BAOVIET
	name text NOT NULL,
	cash numeric(19,2) NOT NULL,        -- The cash on hand
	account_type text NOT NULL,         -- The account FOLLOWER | TRADER
	initialized boolean NOT NULL DEFAULT FALSE
);

CREATE TABLE followerInfo (
	username text PRIMARY KEY REFERENCES account (username),
	risk_factor integer NOT NULL DEFAULT 50
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


-- A transaction holds the state of an order.
CREATE TABLE transaction (
	order_id text PRIMARY KEY,
	username text NOT NULL,
	mimicking_username text,   -- Can be null if this order is made by a trader
	symbol text NOT NULL,
	quantity integer NOT NULL,
	price numeric(19, 2) NOT NULL,
	date timestamp with time zone NOT NULL,
	side text NOT NULL,     -- NS/NB
	type text NOT NULL,     -- MP, LO, etc.
	matched_price numeric(19,2),   -- These two can be NULL,
	matched_quantity integer ,     -- meaning this order has not been matched yet.
	status text NOT NULL DEFAULT 'PendingNew',  -- https://ivnd.vndirect.com.vn/pages/viewpage.action?pageId=209682456
	FOREIGN KEY (username, mimicking_username) REFERENCES following (follower, trader)
);


-- A deal is a buying transaction and a matching selling transaction
CREATE TABLE deal (
	id serial PRIMARY KEY,
	buying_order_id text REFERENCES transaction (order_id),
	selling_order_id text REFERENCES transaction (order_id)
);

commit;
