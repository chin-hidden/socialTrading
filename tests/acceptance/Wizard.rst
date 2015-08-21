.. code:: robotframework

    *** Settings ***
    Library     Selenium2Library
    Test teardown   Close all browsers

    *** Variables ***
    ${BASE_ADDRESS}  http://172.28.128.3

    *** Test Cases ***
    Show wizard on first login
        Open browser    ${BASE_ADDRESS}  browser=chrome
