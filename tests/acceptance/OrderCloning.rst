.. code:: robotframework

    *** Settings ***

    Library         Process
    Library         Selenium2Library
    Library         CustomCommands.py
    Test teardown   Close all browsers


    *** Variables ***

    ${BASE_ADDRESS}  http://172.28.128.3
    ${USERNAME}
    ${PASSWORD}
    ${ROOT}  ../..


    *** Keywords ***

    Load fixture
        [Arguments]   ${name}
        Run process   vagrant ssh -c "cd /vagrant/tests/acceptance; psql duber < ${ROOT}/db/schema.sql; psql duber < ${name};"  shell=True

    Login to account page
        Open browser                   ${BASE_ADDRESS}/account  browser=chrome
        Click element                  btn-submit-demo


    *** Test Cases ***

    Cập nhật giao diện khi có lệnh mua
        Load fixture                   order_fixtures.sql
        Login to account page
        Wait until element is visible  link=Danh mục đầu tư
        Click element                  link=Danh mục đầu tư
        Select from list               tag=select  Theo chiến lược gia
        Execute order                  {"orderId": "lol", "account": "0101807860", "side": "1", "symbol": "VND", "qty": 100, "price": 23000, "transactTime": 1428285620000, "tradeDate": "20150406-09:00:20", "matchedQty": 100, "matchedPrice": 23100, "eventName": "EXECUTED"}
        Sleep                          1
        Table row should contain       deal-listing  1  Xin Một Lần Thua
        Table row should contain       deal-listing  2  VND
        Table row should contain       deal-listing  2  Đã mua

    Hai lệnh mua của hai trader
        Load fixture                   two_traders_buy.sql
        Login to account page
        Wait until element is visible  link=Danh mục đầu tư
        Click element                  link=Danh mục đầu tư
        Select from list               tag=select  Theo chiến lược gia
        Execute order                  {"orderId": "lol1", "account": "account-trader-01", "side": "1", "symbol": "VND", "qty": 100, "price": 23000, "transactTime": 1428285620000, "tradeDate": "20150406-09:00:20", "matchedQty": 100, "matchedPrice": 23100, "eventName": "EXECUTED"}
        Sleep                          1
        Execute order                  {"orderId": "lol2", "account": "account-trader-02", "side": "1", "symbol": "VND", "qty": 100, "price": 23000, "transactTime": 1428285620000, "tradeDate": "20150406-09:00:20", "matchedQty": 100, "matchedPrice": 23100, "eventName": "EXECUTED"}
        Sleep                          1
        Table row should contain       deal-listing  1  Xin Một Lần Thua
        Table row should contain       deal-listing  3  Lỗ Là Gì

    Cập nhật giao diện khi bán deal đang giữ
        Load fixture                   selling.sql
        Login to account page
        Wait until element is visible  link=Danh mục đầu tư
        Click element                  link=Danh mục đầu tư
        Select from list               tag=select  Theo chiến lược gia
        Execute order                  {"orderId": "lol", "account": "0101807860", "side": "2", "symbol": "VND", "qty": 100, "price": 23000, "transactTime": 1428285620000, "tradeDate": "20150406-09:00:20", "matchedQty": 100, "matchedPrice": 23100, "eventName": "EXECUTED"}
        Sleep                          1
        Table should contain           deal-listing  Đã bán
