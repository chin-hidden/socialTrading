import inflection


def dict_keys_in_camel_case(dictionary):
    """\
    Clone a dictionary and camelize all of its keys.
    """
    return dict(
        map(lambda (k, v): (inflection.camelize(k, uppercase_first_letter=False), v),
            dictionary.items()))
