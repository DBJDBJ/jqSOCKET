
after moving to jQ 1.9.1 moreSelectors.js has issues:

1.
"[~right]" has to be changed to "[~ right]"
2.
after which 
Expr.filter.ATTR = function(elem, match) 
receives 'match' argument as undefined ...


Long explanation, FOR PUBLIC, will be here:
http://dbj.org/dbj/?page_id=734
with jQuery 1.4.1  this works
