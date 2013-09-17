/**
 * @license MIT
 * @version 0.1.0-alpha
 */
(function() {

    const E = "",
        AMP = "&",
        EQ = "=",
        READABILITY_URL = "www.readability.com",
        READABILITY_PARSER_PATH = "/api/content/v1/parser",
        toStr = String,
        request = require('request'),
        util = require('util'),
        querystring = require('querystring'),
        events = require('events');

    var Readability;

    /**
     * Readability article parsing and bokmarking web API wrapper. This eases the pain
     * of performing common tasks while working with the API of readability.com. For
     * more information on reability API visit their website
     * [http://www.readability.com/developers/api]
     * (http://www.readability.com/developers/api).
     *
     * As per readability.com website, *"the Parser API is freely available on a limited basis.
     * If you'd like to use the Parser API for commercial use, get in touch with us at
     * [licensing@readability.com](mailto:licensing@readability.com) to learn about our licensing
     * options."*
     *
     * @global
     * @constructor
     * @param {object=} [options] - Configuration for a new instance of the readability.
     *
     * @example
     * // Use Readability to procure the excerpt of an article.
     * var rdblty = new Readability({
     *     parserAPIKey: "myapikeyfromreadability.com"
     * });
     * rdblty.parse('http://somedomain.com/somearticle/', function (data) {
     *     console.log(data.excerpt);
     * });
     */
    Readability = function (options) {
        options = options || {};

        var parserAPIKey = E;

        /**
         * Get or set the parser API key
         * @param {string=} [key] - Parser API key for subsequent use.
         * Do not provide any key if you want to just retrive the current
         * key.
         * @returns {string} - Readability parser API key being used.
         */
        this.parserkey = function (key) {
            return (parserAPIKey = toStr(options.parserAPIKey || parserAPIKey));
        };
    };
    // Make Readability function inherit from EventEmitter.
    util.inherits(Readability, events.EventEmitter);

    /**
     * Returns a fully formed API access URL to Readability server.
     * @static
     * @private
     * @memberOf Readability
     * @param {string} key - The parser API key to be used to pass
     * on to Readability servers.
     * @param {string} articleUrl - Url of the article that is required
     * to be parsed.
     * @returns {string} Readability API Url ready to be requested.
     */
    Readability.getParserUrl = function (key, articleUrl) {
        return "https://" + READABILITY_URL + READABILITY_PARSER_PATH + "?" + querystring.stringify({
            token: key,
            url: articleUrl
        });
    };

    /**
     * Accepts a URL and parses it for its article mode by sending it to Readability.
     * servers.
     * @memberOf Readability
     * @param {string} url - The URL of the article that needs to be parsed.
     * @param {function=} [success] - Callback function that will be executed upon successful parsing.
     * @fires #parse
     */
    Readability.prototype.parse = function (url, success) {
        var proxy = this;
        request(Readability.getParserUrl(proxy.parserkey(), url), function(error, response, body) {
            var data;
            if (!error && response.statusCode === 200) {
                // Try and convery json string from body to a JS object and on failure
                // compile an error object.
                try {
                    data = JSON.parse(body);
                } catch (err) {
                    data = {
                        error: err
                    };
                }

                /**
                 * Readability article parse event. This event is fired every time
                 * an article has been parsed.
                 *
                 * @event Readability#parse
                 * @param {object} [data] - Article parse result in JSON format.
                 */
                proxy.emit("parse", data);
                try {
                    success.call(proxy, data);
                } catch (err) {}
            }
        });
    };


    module && (module.exports = {
        new: function(options) {
            return new Readability(options);
        }
    });

}());
