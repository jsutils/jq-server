/**
 * Created by lalittanwar on 22/01/16.
 */

define({
    name: "jsutils.server",
    modules: ["jQuery", "URI"]
}).as(function(SERVER, jQuery, URI) {

    var hardCahce = {};

    return {
        apiServer: bootloader.config().apiServer || "/data/",
        urlMap: {
            "newTaxClass": "taxengine-admin/taxclass",
            "taxClass": "taxengine-admin/taxclass/{code}",
            "taxClassCodes": "taxengine-admin/taxclass/codes",
            "destinations": "taxengine-admin/location/citystates"
        }, _done_: function() {
        }, _fail_: function() {
        }, _always_: function() {
        }, addCallbacks: function($promise, url, data, _config) {
            var self = this;
            return $promise.done(function(resp) {
                return self._done_(resp, url, data, _config);
            }).fail(function(resp) {
                return self._fail_(resp, url, data, _config);
            }).always(function(resp) {
                return self._always_(resp, url, data, _config);
            });
        },
        get: function(url, data, _config) {
            return this.addCallbacks((function(self) {
                if (config && config.cache && hardCahce[url]) {
                    return hardCahce[url];
                }
                var config = _config || {};
                hardCahce[url] = jQuery.ajax({
                    type: "get",
                    url: self.apiServer + self.prepare(url, config),
                    data: data,
                    contentType: "application/json",
                    headers: config.headers
                });
                return hardCahce[url];
            })(this).then(function(resp) {
                return JSON.parse(JSON.stringify(resp === undefined ? "" : resp));
            }), data, _config);
        },
        post: function(url, data, _config) {
            var config = _config || {};
            return this.addCallbacks(jQuery.ajax({
                url: this.apiServer + this.prepare(url, config),
                data: JSON.stringify(data),
                contentType: "application/json",
                type: "post",
                headers: config.headers
            }), data, _config);
        },
        put: function(url, data, _config) {
            var config = _config || {};
            return this.addCallbacks(jQuery.ajax({
                url: this.apiServer + this.prepare(url, config),
                data: JSON.stringify(data),
                contentType: "application/json",
                type: "put",
                headers: config.headers
            }), data, _config);
        },
        delete: function(url, data, _config) {
            var config = _config || {};
            return this.addCallbacks(jQuery.ajax({
                type: "delete",
                url: this.apiServer + this.prepare(url, config),
                data: data,
                contentType: "application/json",
                headers: config.headers
            }), data, _config);
        },
        open: function(url, data, config) {
            var query = URI.param(data);
            query = query ? ("?" + query) : "";
            return window.open(this.prepare(url, config) + query);
        },
        prepare: function(url, config) {
            url = (this.urlMap[url] || url);
            for (var i in config) {
                url = url.replace("{" + i + "}", config[i]);
            }
            return url;
        },
    };
});
