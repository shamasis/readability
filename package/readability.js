/*
 Readability Node Wrapper by Shamasis Bhattacharya <http://readability.shamasis.net/>
 @version 0.1.0
*/
(function(){var c=String,f=require("request"),g=require("util"),h=require("querystring"),k=require("events"),a;a=function(a){a=a||{};var d=this,b=c(a.parserAPIKey||"");this.key=function(a){if(!(a=c(a||"")))return b;b!==a&&(d.emit("keychange",a),b=a);return b}};g.inherits(a,k.EventEmitter);a.defaultOptions={parserAPIKey:""};a.getAPIUrl=function(a,d){return"https://www.readability.com/api/content/v1/parser?"+h.stringify({token:a,url:d})};a.prototype.parse=function(c,d){var b=this;f(a.getAPIUrl(b.key(),
c),function(a,c,f){var e;if(!a&&200===c.statusCode){try{e=JSON.parse(f)}catch(g){e={error:g}}b.emit("parse",e);try{d.call(b,e)}catch(h){}}})};module&&(module.exports={Parser:a})})();