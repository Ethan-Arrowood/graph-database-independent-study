// Create Summers
UNWIND {summers} as summer
MERGE (s:Summer {year: summer.value})
RETURN s