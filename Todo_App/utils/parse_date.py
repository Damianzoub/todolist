from datetime import datetime


def parse_date(s):
    if not s:
        return None
    
    for fmt in ("%Y-%m-%d","%d-%m-%Y","%d/%m/%Y"):
        try:
            return datetime.strptime(s,fmt).date()
        except ValueError:
            continue
    return ValueError(f"Invalid due_date format: {s}. Ues YYYY-MM-DD.")