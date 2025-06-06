from evals.fns.remove_html_tags import remove_html_tags

def extract_between_markers(text):
    begin_marker = '[BEGIN SUBMISSION]:'
    end_marker = ':[END SUBMISSION]'

    begin_index = text.find(begin_marker)
    end_index = text.find(end_marker)

    if begin_index == -1 or end_index == -1 or begin_index >= end_index:
        return None

    content = text[begin_index + len(begin_marker):end_index].strip()
    return remove_html_tags(content)