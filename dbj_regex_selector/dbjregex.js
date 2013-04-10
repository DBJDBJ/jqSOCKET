
/*
Inspired by : http://james.padolsey.com/javascript/regex-selector-for-jquery/
which was not working because if was returning true on non existent attributes,
properties or css props
Also added prop label, so that http://api.jquery.com/prop/ can be used 

NOTES:
-- W3C operators only
*/
(function (jQuery, undefined) {

    var dbj = (top.dbj = top.dbj || { }),
    nop = function (check) { return !!check; },
    OP = new function () {

        var rx = {
            label_name: /(.+):(.+)/,
            validOps : /(\!=|\^=|\*=|\$=|\~=|\|=|=)/g,
            validLabels: /^(data|css|prop):/,
            /* if no label 'attr' is default */
            parse_label_name: function (expr, retval) {
                retval = retval || { lab: null, prop: null };
                expr = expr.trim();
                retval.lab = expr.match(rx.validLabels) ? expr.split(':')[0] : 'attr';
                retval.prop =  expr.replace(rx.validLabels, '') ;
                return retval;
            }
        },
        /* set of W3C standard operators */
        map = {
            "!=": function (result, check) { return result !== check; },
            "^=": function (result, check) { return check && result.indexOf(check) === 0; },
            "*=": function (result, check) { return check && result.indexOf(check) > -1; },
            "$=": function (result, check) { return check && result.slice(-check.length) === check; },
            "~=": function (result, check) { return (" " + result + " ").indexOf(check) > -1; },
            "|=": function (result, check) { return result === check || result.slice(0, check.length + 1) === check + "-"; },
            "=": function (result, check)  { return result === check; },
        };

        dbj[":"] = map; /* for users to add operators */

        this.set = function ( op, fun ) { map[op] = fun; }
        this.get = function ( expr ) {
            for (var op in map ) {
                if ( expr.indexOf(op) > -1 ) return map[op] ;
            }
            return null;
        }
        this.parse = function ( expr ) {
            var retval = { lab: null, prop: null, op: null, check: null, fun : null } ;
            for (var op in map ) {
                if ( expr.indexOf(op) > -1 ){
                    retval.op = op;
                    retval.fun = map[op] || null;
                    if ("function" != typeof retval.fun) throw ":dbj() handler for operator " + retval.op + ", not found ?";
                    expr = expr.split(op);
                    if (!expr[1]) throw ":dbj() operator rvalue not found in a selector";
                    retval.check = expr[1].trim() ;
                    rx.parse_label_name(expr[0], retval);
                    break;
                }
            }
            /* we might have a simple expression with no operator  */
            if (!retval.op) {
                /* therefore no space allowed */
                if (expr.match(/\s/)) throw ":dbj() simple selector can not have a space in selector";
                rx.parse_label_name(expr, retval);
            }
            if (!retval.prop) throw ":dbj() name not found ?";
            return retval ;
        }
    }
    /*
    op = new OP() ;
    op.set("=", function (a,b) { return a === b;} );
    op.get("......=.......");
    */


    jQuery.expr[':']['rx'] = function (elem, index, match) {
        if (!match[3]) return false;
        // pedestrian code because of debugging
        var input = OP.parse(match[3].trim());
        var current_value_ = jQuery(elem)[input.lab](input.prop);
        var result = input.op ? input.fun(current_value_, input.check)
            : nop(current_value);
        return result;
    }
}($ || jQuery));
/*
usage:
var $see_mee_in_debugger_ = $("div:rx(css:right = 10px)");
*/

(function (jQuery, undefined) {
    /*
    (c) 2013 by DBJ.ORG, GPL/MIT applies
 
    expr arguments is any legal jQuery selector.
    returns array of { element: , events: } objects
    where events is jQuery events structure attached (as  data)
    to the element
    return is null on no events attached
 */
    jQuery.events = function (expr) {
        var rez = [], evo;
        jQuery(expr).each(
           function () {
               if (evo = jQuery._data(this, "events"))
                   rez.push({ element: this, events: evo });
           });
        return rez.length > 0 ? rez : null;
    }

}($ || jQuery));

/*
    // map operators to their processors 
var NOP = "nop",
    opmap = {
        "!=": function (result, check) { return result !== check; },
        "^=": function (result, check) { return check && result.indexOf(check) === 0; },
        "*=": function (result, check) { return check && result.indexOf(check) > -1; },
        "$=": function (result, check) { return check && result.slice(-check.length) === check; },
        "~=": function (result, check) { return (" " + result + " ").indexOf(check) > -1; },
        "|=": function (result, check) { return result === check || result.slice(0, check.length + 1) === check + "-"; },
        "=": function (result, check) { return result === check; },
        // no operator given in input 
        "nop": function (result) { return !!result; }
    },
validOps = /(\!=|\^=|\*=|\$=|\~=|\|=|=)/g,
get_op = function (expr) {
    var op = null;
    expr.replace(validOps, function (x) {
        op = x;
    });
    return op;
},
validLabels = /^(data|css|prop):/,
label_name = function (expr) {
    return {
        label: expr.match(validLabels) ? expr.split(':')[0] : 'attr',
        name: expr.replace(validLabels, '')
    }
},
proc_input = function (expr) {
    var nv = {
        method: null,
        name: null,
        op: get_op(expr) || NOP,
        check: null
    }, ln;

    if (nv.op === NOP) {
//if no operator in expession we take it as a single name expression   eg. "id" or "css:left"        ln = label_name(expr.trim());
    } else {
        expr = expr.split(nv.op);
        ln = label_name(expr[0].trim());
        nv.check = !!expr[1] ? expr[1].trim() : null;
    }
    nv.method = ln.label; nv.name = ln.name;

    if (nv.op !== NOP && !nv.check) {
        throw "Syntax error, operator with no rvalue";
    }
    return nv;
};

*/