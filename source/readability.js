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

    var ReadabilityParser;

    /**
     * **Readability article parsing and bokmarking web API wrapper.**
     *
     * This library eases the pain of performing common tasks while working with the API of readability.com. For more
     * information on reability API visit their website http://www.readability.com/developers/api.
     *
     * As per readability.com website, *"the Parser API is freely available on a limited basis. If you'd like to use
     * the Parser API for commercial use, get in touch with us at licensing@readability.com to learn about our
     * licensing options."*
     *
     * @global
     * @constructor
     * @param {object=} [options] - Configuration for a new instance of the readability.
     * The possible options that you can pass are part of {@link ReadabilityParser.defaultOptions}.
     *
     * @example
     * // Use Readability to procure the excerpt of an article.
     * var rdblty = new ReadabilityParser({
     *     parserAPIKey: "myapikeyfromreadability.com"
     * });
     * rdblty.parse('http://somedomain.com/somearticle/', function (data) {
     *     console.log(data.excerpt);
     * });
     */
    ReadabilityParser = function (options) {
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
    util.inherits(ReadabilityParser, events.EventEmitter);

    /**
     * Default set of options that are used while communicating with Readability
     * API servers. These are the set of options that can be passed on to a new
     * instance of `Readability` in order to override the defaults.
     * @enum
     * @memberOf ReadabilityParser
     */
    ReadabilityParser.defaultOptions = {
        /**
         * Provide the API key required by readability.com servers for using the API. Though this is optional during
         * instantiating a {@link ReadabilityParser} class, it is a required parameter to be set before actually making
         * any request to the readability servers. If not provided initially, it can be later set using
         * {@link ReadabilityParser#parserkey} method.
         * @type {string}
        */
        parserAPIKey: ""
    };

    /**
     * Returns a fully formed API access URL to Readability server.
     * @static
     * @private
     * @memberOf ReadabilityParser
     * @param {string} key - The parser API key to be used to pass
     * on to Readability servers.
     * @param {string} articleUrl - Url of the article that is required
     * to be parsed.
     * @returns {string} Readability API Url ready to be requested.
     */
    ReadabilityParser.getParserUrl = function (key, articleUrl) {
        return "https://" + READABILITY_URL + READABILITY_PARSER_PATH + "?" + querystring.stringify({
            token: key,
            url: articleUrl
        });
    };

    /**
     * Accepts a URL and parses it for its article mode by sending it to Readability.
     * servers.
     * @memberOf ReadabilityParser
     * @param {string} url - The URL of the article that needs to be parsed.
     * @param {function=} [success] - Callback function that will be executed upon successful parsing.
     * @fires #parse
     */
    ReadabilityParser.prototype.parse = function (url, success) {
        var proxy = this;
        request(ReadabilityParser.getParserUrl(proxy.parserkey(), url), function(error, response, body) {
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
                 * @event ReadabilityParser#parse
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
        Parser: ReadabilityParser
    });

}());
