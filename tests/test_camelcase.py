from socialtrading.utils import *


def test_dict_keys_in_camel_case():
    """\
    The keys should be converted into camel case.
    """
    assert dict_keys_in_camel_case({"a_b": True}) == {"aB": True}
    assert dict_keys_in_camel_case({"a": True}) == {"a": True}
    assert dict_keys_in_camel_case({"a_b_c": True}) == {"aBC": True}
    assert dict_keys_in_camel_case({"a_beautiful_mind": True}) == {"aBeautifulMind": True}
    assert dict_keys_in_camel_case({"account_type": True}) == {"accountType": True}
