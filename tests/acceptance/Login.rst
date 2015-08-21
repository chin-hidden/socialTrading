.. code:: robotframework

    *** Settings ***
    Library         Selenium2Library
    Library         CustomCommands.py
    Test teardown   Close all browsers

    *** Variables ***
    ${BASE_ADDRESS}  http://172.28.128.3
    ${USERNAME}
    ${PASSWORD}

    *** Test Cases ***
    The account page should require login
        Open browser                ${BASE_ADDRESS}/account  browser=chrome
        Location should contain     /login

    The user should be able to use VNDIRECT's account to login
        Open browser                ${BASE_ADDRESS}/account  browser=chrome
        Input text                  username  ${USERNAME}
        Input password              password  ${PASSWORD}
        Click element               btn-submit-real
        Location should not contain     /login

    Should allow logging in as the demo user
        Open browser                ${BASE_ADDRESS}/account  browser=chrome
        Click element               btn-submit-demo
        Location should contain     /account
