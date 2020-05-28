var i18n = require("i18n");
var Hbs = require("handlebars");
var HbsUtils = require("handlebars-utils");
var path = require("path");

var i18nconfig = {
    locales: ['en', 'de'],
    defaultLocale: 'en',
    cookie: 'lang',
    queryParameter: 'lang',
    directory: path.join(__dirname,'..','locales')
};
i18n.configure(i18nconfig);

var GetPropertyValue = (obj, dataToRetrieve) => {
    return dataToRetrieve
        .split('.')
        .reduce(function(o, k) {
            return o && o[k];
        }, obj);
};

var register = function(Handlebars) {
    var helpers = {
        // Textarea output: Convert \n to a working line break and remove \r
        breaklines: function(text) {
            text = HbsUtils.escapeExpression(text);
            text = text.replace(/\n/gm, '&#10;').replace(/\r/gm, '');
            return new Hbs.SafeString(text);
        },

        // i18n helpers
        __: function () {
            return i18n.__(arguments[0]);
        },
        __n: function () {
            return i18n.__n(arguments[0],arguments[1],arguments[2]);
        },

        // inArray helper
        inArray: function (elem, list, key, options) {
            let _r = false;

            if(typeof list !== 'undefined') {
                if(typeof key === 'undefined') {
                    if (list.indexOf(elem) > -1) {
                        _r = true;
                    }
                }
                else {
                    list.forEach( (entry, i) =>{
                        if(String(elem) == String(GetPropertyValue(entry,key))) {
                            _r = true;
                        }
                    });
                }
            }

            return _r ? options.fn(this) : options.inverse(this);
        },

        // ifCond helper
        ifCond: function (v1, operator, v2, options) {
            // Use string to compare
            v1 = String(v1);
            v2 = String(v2);
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        },
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        // register helpers
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }

};

module.exports.register = register;
module.exports.helpers = register(null);
