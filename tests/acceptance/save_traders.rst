.. code:: robotframework

    *** Settings ***
    Library         Process
    Library         Selenium2Library  timeout=10
    Library         CustomCommands.py
    Test teardown   Close all browsers

    *** Variables ***
    ${BASE_ADDRESS}  http://172.28.128.3:5000/
    ${USERNAME}
    ${PASSWORD}
    ${ROOT}  ../..

    *** Keywords *** 
    Load fixture
        [Arguments]   ${name}
        Run process   vagrant ssh -c "cd /vagrant/tests/acceptance; psql duber < ${ROOT}/db/schema.sql; psql duber < ${name};"  shell=True
    
    Open wizard with demo account
        Open browser                   ${BASE_ADDRESS}/wizard  browser=chrome
        Click element                  btn-submit-demo
        Wait until page contains element       css=div.wizard

    *** Test Cases ***
    
    Lưu trader sau khi chọn ở trang wizard
        Load fixture                    save_traders.sql
        Open wizard with demo account
        Click element               css=.row-action input
        Click element               link=Hide »
        Click element               css=.btn.btn-primary
        Wait until element is visible  link=Danh mục đầu tư
        Page should contain             Xin Một Lần Thua