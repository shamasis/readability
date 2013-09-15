(function() {

	var E = "",
		AMP = "&",
		EQ = "=",
		READABILITY_URL = "www.readability.com",
		READABILITY_PARSER_PATH = "/api/content/v1/parser",
		
		serialiseQueryString,
		Readability,
		request = require("request");
		
		
	serialiseQueryString = function (queries) {
		var go = [],
			i,
			ii;
			
		if (Array.isArray(queries)) {
			for (i = 0, ii = queries.length; i < ii; i++) {
				if (Array.isArray(queries[i]))  {
					go.push(queries[i].join(EQ));
				}
			}
		}

		return go.join(AMP);
	};

	Readability = function (options) {
		if (!options) {
			throw "Proxy cannot read mind... yet";
		}

		var proxy = this,
			parserAPIKey = options.parserAPIKey,
			readerAPIKey = options.readrAPIKey;

		proxy.getParserAPI = function() {
			return parserAPIKey;
		};

		proxy.readerParserAPI = function() {
			return readerAPIKey;
		};
	};
	
	Readability.prototype.getParserUrl = function (articleUrl) {
		var proxy = this,
			url = "https://" + READABILITY_URL + READABILITY_PARSER_PATH + "?";
		
		url += serialiseQueryString([
			['token', proxy.getParserAPI()],
			['url', articleUrl]
		]);
		
		return url;
	};

	Readability.prototype.parseUrl = function(url, callback) {
		var proxy = this;

		if (typeof callback === 'function') {
			request(proxy.getParserUrl(url), function(error, response, body) {
				if (!error && response.statusCode === 200) {
					callback(JSON.parse(body));
				}
			});
		}

	};
	
	module && (module.exports = {
		initialize: function (options) {
			return new Readability(options);
		}
	});

}());
