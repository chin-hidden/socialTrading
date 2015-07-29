# coding: utf8

import pytest
import socialtrading


@pytest.fixture
def app():
    socialtrading.app.config["TESTING"] = True
    return socialtrading.app.test_client()



def test_show_logout_button(app):
    """Only show the logout button if the user is logged in."""
    rv = app.get("/")
    assert u"Đăng xuất" not in rv.get_data(as_text=True)

    rv = app.post("/login",
        data={"username": "ndtrung4419", "password": "***REMOVED***"},
        follow_redirects=True)
    assert u"Đăng xuất" in rv.get_data(as_text=True)
