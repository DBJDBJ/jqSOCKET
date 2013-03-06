
/*
Inspired by : http://james.padolsey.com/javascript/regex-selector-for-jquery/
which was not working because if was returning true on non existent attributes,
properties or css props
Also added prop label, so that http://api.jquery.com/prop/ can be used 
*/
(function (jQuery,undefined) {

    jQuery.expr[':'].rx = function (elem, index, match) {
        var matchParams = match[3].split(','),
            validLabels = /^(data|css|prop):/,
            attr = {
                method: matchParams[0].match(validLabels) ?
                            matchParams[0].split(':')[0] : 'attr',
                property: matchParams.shift().replace(validLabels, '')
            },
            regexFlags = 'ig',
            regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
        /* 2012 MAR 06 DBJ replaced 
        return regex.test(jQuery(elem)[attr.method](attr.property));
        with this:
        */
        var value_ = jQuery(elem)[attr.method](attr.property);
        return !!value_ && regex.test(value_);
    }
}($ || jQuery))
/*
usage:
var $see_mee_in_debugger_ = $(":rx(css:right,\\d+)");
*/