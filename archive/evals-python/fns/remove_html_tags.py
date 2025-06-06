import re

def remove_html_tags(input_string):
    return re.sub(r'<\/?[^>]+(>|$)', '', input_string)