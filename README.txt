
With jQuery 1.4.1  this works as before, after moving to jQ 1.9.1 moreSelectors.js has issues:

1.
"[~right]" has to be changed to "[~ right]" to work
2.
"button [~ right]" gives syntax error
OK if only attribute selectos are used 
3.
All the other attr prefixes are not tested

Long explanation, FOR PUBLIC, will be here:
http://dbj.org/dbj/?page_id=734

