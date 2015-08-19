
--
-- Initial test data
--


INSERT INTO account (account_number, username, password, name, cash, account_type, broker) VALUES
       ('0001234567', 'demo.user', 'password', 'Người sử dụng Demo', 100000000, 'FOLLOWER', '__DEMO__'),
       ('0001032425', 'thangnt.nhtck47', 'password', 'Nguyễn Toàn Thắng', 100000000, 'FOLLOWER', 'VNDIRECT'),
       ('0101807860', 'trader01', 'password', 'Xin Một Lần Thua', 4500000, 'TRADER', 'VNDIRECT'),
       ('0001008969', 'trader02', 'password', 'Lỗ Là Gì', 4500000, 'TRADER', 'VNDIRECT'),
       ('0101018086', 'trader03', 'password', 'Bàn Tay Vàng', 4500000, 'TRADER', 'VNDIRECT'),
       ('0001068688', 'trader04', 'password', 'Hiệp Sĩ Bóng Đêm', 4500000, 'TRADER', 'VNDIRECT'),
       ('3101000330', 'trader05', 'password', 'Cao Thủ Lướt Sóng', 4500000, 'TRADER', 'VNDIRECT'),
       ('0001888989', 'trader06', 'password', 'Chiến Binh Thép', 4500000, 'TRADER', 'VNDIRECT'),
       ('0001569999', 'trader07', 'password', 'Vô Thần', 4500000, 'TRADER', 'VNDIRECT'),
       ('0001111987', 'trader08', 'password', 'Cả Trái Đất', 4500000, 'TRADER', 'VNDIRECT'),
       ('0304008739', 'trader09', 'password', 'Đông Phương Bất Bại', 4500000, 'TRADER', 'VNDIRECT'),
       ('0001388888', 'trader10', 'password', 'Đánh Là Thắng', 4500000, 'TRADER', 'VNDIRECT');


UPDATE account SET is_demo_account = TRUE WHERE username = 'demo.user';


INSERT INTO followerInfo (username, risk_factor) VALUES
       ('thangnt.nhtck47', 50),
       ('demo.user', 50);

INSERT INTO traderInfo (username, description) VALUES
       ('trader01', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis sapien a nisl mollis iaculis.'),
       ('trader02', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis sapien a nisl mollis iaculis.'),
       ('trader03', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis sapien a nisl mollis iaculis.'),
       ('trader04', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis sapien a nisl mollis iaculis.'),
       ('trader05', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis sapien a nisl mollis iaculis.'),
       ('trader06', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis sapien a nisl mollis iaculis.'),
       ('trader07', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis sapien a nisl mollis iaculis.'),
       ('trader08', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis sapien a nisl mollis iaculis.'),
       ('trader09', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis sapien a nisl mollis iaculis.'),
	('trader10', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis sapien a nisl mollis iaculis.');


-- for now, we only allow single following relationship
INSERT INTO following (follower, trader, allocated_money) VALUES
	('demo.user', 'trader01', 100000000);


INSERT INTO transaction VALUES
       ('123123', 'demo.user', 'trader01', 'VND', 123, 1232, 'now', 'NB', 'MP', NULL, NULL);

INSERT INTO deal (buying_order_id) VALUES
       ('123123');
