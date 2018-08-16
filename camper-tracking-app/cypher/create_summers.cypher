// Summer Data
:params summers => [
  { value: 2000 },
  { value: 2001 },
  { value: 2002 },
  { value: 2003 },
  { value: 2004 },
  { value: 2005 },
  { value: 2006 },
  { value: 2007 },
  { value: 2008 },
  { value: 2009 },
  { value: 2010 },
  { value: 2011 },
  { value: 2012 },
  { value: 2013 },
  { value: 2014 },
  { value: 2015 },
  { value: 2016 },
  { value: 2017 },
  { value: 2018 }
]

// Create Summers
UNWIND {summers} as summer
MERGE (s:Summer {year: summer.value})
RETURN s