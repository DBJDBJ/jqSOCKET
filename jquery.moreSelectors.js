/*!
* Enhanced attribute selectors for Sizzle/jQuery
* Version: 1.0.1
* Copyright (c) 2009 Balazs Endresz (BE) (balazs.endresz@gmail.com)
* 
* Released under the MIT, BSD, and GPL Licenses.

 2010-04-21 Balazs fix for jQuery (Sizzle) 1.4.2

*/

(function(Sizzle) {

    var Expr = Sizzle.selectors;

    /* 2012 MAR 03 DBJ moved here */
    Expr.attrPrefix = {
        ':': function (e, val) { return $(e).data(val); },
        '~': function (e, val) { return $.css(e, val); }, /* Mar-2013 DBJ replaced curCSS() with css() */
        '&': function (e, val) { var d = $.data(e, 'events'); return d && d[val]; },
        '::': function (e, val) { var d = $.data(e, 'metadata'); return d && d[val]; }
    };

    /* 2013 MAR 03 this has to stay even for jQ 1.9.1 
       otherwise attr prefixes above will not be recognized
    */
    Expr.match.ATTR = /\[\s*(\W*(?:[\w\u00c0-\uFFFF_-]|\.|\\.)+)\s*(?:(\S?[=<>])\s*(['"]*)(.*?)\3|)\s*\](?![^\[]*\])(?![^\(]*\))/;
    //inserted:              \W*                      |\.                 [ <>]                         lookahead appended later

    /* 2013 Mar 03 DBJ */
    if (! Expr.leftMatch) Expr.leftMatch = {} ;

        /* 2010-04-21 Balazs fix for jQuery (Sizzle) 1.4.2 */
       // Expr.leftMatch.ATTR = new RegExp(/(^(?:.|\r|\n)*?)/.source +
       // Expr.match.ATTR.source.replace(/\\(\d+)/g, function (all, num) { return "\\" + (num - 0 + 1); }));
        
    /* 
    2012 MAR 04: DBJ
    This was the BE version that worketh with jq 1.4.x
    this was the footprint: var BE_ATTR = function(elem, match) {

    this version uses Sizzle.selectors.attrPrefix 
    */
    var BE_ATTR = function(elem, name_, operator_, check_ ) {

        var name = name_,
		result,
		value,
		type = operator_ ,
		check = check_ ,
		prefix = name.match(/(^\W+)(.*)/);

        if (prefix !== null) {
            for (var i in Expr.attrPrefix)
                if (i === prefix[1].trim()) {
                result = Expr.attrPrefix[i](elem, prefix[2]);
                break;
            }
        } else
            result = Expr.attrHandle[name] ?
			Expr.attrHandle[name](elem) :
			elem[name] != null ?
				elem[name] :
				elem.getAttribute(name);

        value = result + "";

        var ret = result == null ?
		type === "!=" :
		type === "=" ?
		value === check :
		type === "*=" ?
		value.indexOf(check) >= 0 :
		type === "~=" ?
		(" " + value + " ").indexOf(check) >= 0 :
		!check ?
		result === 0 || result :
		type === "!=" ?
		value != check :
		type === "^=" ?
		value.indexOf(check) === 0 :
		type === "$=" ?
		value.substr(value.length - check.length) === check :
		type === "|=" ?
		value === check || value.substr(0, check.length + 1) === check + "-" :
		type === "/=" ?
		new RegExp(check).test(value) :
		false;

        if (ret || type && type.match(/<|>/) === null) return ret;

        var newValue = parseFloat(value), newCheck = parseFloat(check);
        value = isNaN(newValue) ? value : newValue;
        check = isNaN(newCheck) ? check : newCheck;

        return type === "<" ? value < check :
		type === ">" ? value > check :
		type === "<=" ? value <= check :
		type === ">=" ? value >= check :
		false;
    } /* eof BE_ATTR */

    /* 2013 MAR 04 DBJ: this is the latest ATTR() taken from Sizzle */
    Expr.filter.ATTR = function (name, operator, check) {
        return function (elem) {
               return BE_ATTR(elem, name, operator, check);
            /*
            var result = Sizzle.attr( elem, name );
            if ( result == null ) {
                return operator === "!=";
            }
            if ( !operator ) {
                return true;
            }
            result += "";
            return operator === "=" ? result === check :
                operator === "!=" ? result !== check :
                operator === "^=" ? check && result.indexOf( check ) === 0 :
                operator === "*=" ? check && result.indexOf( check ) > -1 :
                operator === "$=" ? check && result.slice( -check.length ) === check :
                operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
                operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
                false;
        */
        };
    }

})((jQuery && jQuery.find) || Sizzle);

/* 
(function($) {
    //Sizzle.selectors.attrPrefix
    $.extend($.expr.attrPrefix, {
        ':': function(e, val) { return $(e).data(val); },
        '~': function(e, val) { return $.css(e, val); }, // Mar-2013 DBJ replaced curCSS() with css() 
        '&': function(e, val) { var d = $.data(e, 'events'); return d && d[val]; },
        '::': function(e, val) { var d = $.data(e, 'metadata'); return d && d[val]; }
    })

})(jQuery);
*/