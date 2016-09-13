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
            "newSomeClass": "someengine-admin/someclass",
            "destinations": "somengine-admin/location/citystates"
        }, _done_: function() {
        }, _fail_: function() {
        }, _always_: function() {
        }, addCallbacks: function($promise, url, data, _config) {
            var self = this;
            return $promise.done(function(resp) {
                return self._done_(resp, url, data, _config);
            }).fail(function(resp) {
                if (_config._callbacks_ && is.Value(_config._callbacks_[resp.status])) {
                    if (is.Function(_config._callbacks_[resp.status])) {
                        return _config._callbacks_[resp.status](resp, url, data, _config);
                    }
                } else {
                    return self._fail_(resp, url, data, _config);
                }
            }).always(function(resp) {
                return self._always_(resp, url, data, _config);
            });
        },
        request: function(method, url, data, config) {
            return this["do_" + method].apply(this, [url, data, config]);
        },
        get: function(url, data, config) {
            return this.request('get', url, data, config);
        },
        post: function(url, data, config) {
            return this.request('post', url, data, config);
        },
        put: function(url, data, config) {
            return this.request('put', url, data, config);
        },
        "delete": function(url, data, config) {
            return this.request('delete', url, data, config);
        },
        getFrame: function(url, data, config) {
            return this.request('getFrame', url, data, config);
        },
        open: function(url, data, config) {
            return this.request('open', url, data, config);
        },
        submit: function(url, data, config) {
            return this.request('submit', url, data, config);
        },
        do_get: function(url, data, _config) {
            var config = _config || {};
            return this.addCallbacks((function(self) {
                var finalUrl = self.apiServer + self.prepare(url, config)

                var query = URI.param(data);
                query = query ? ("?" + query) : "";

                var finalUrlKey = finalUrl + query;

                if (config && (config.cache || config.$cache) && hardCahce[finalUrlKey]) {
                    return hardCahce[finalUrlKey];
                }
                hardCahce[finalUrlKey] = jQuery.ajax({
                    type: "get",
                    url: finalUrl,
                    data: data,
                    contentType: "application/json",
                    headers: config.headers
                });
                return hardCahce[finalUrlKey];
            })(this).then(function(resp) {
                return JSON.parse(JSON.stringify(resp === undefined ? "" : resp));
            }), url, data, config);
        },
        do_post: function(url, data, _config) {
            var config = _config || {};
            return this.addCallbacks(jQuery.ajax({
                url: this.apiServer + this.prepare(url, config),
                data: JSON.stringify(data),
                contentType: "application/json",
                type: "post",
                headers: config.headers
            }), url, data, config);
        },
        do_put: function(url, data, _config) {
            var config = _config || {};
            return this.addCallbacks(jQuery.ajax({
                url: this.apiServer + this.prepare(url, config),
                data: JSON.stringify(data),
                contentType: "application/json",
                type: "put",
                headers: config.headers
            }), url, data, config);
        },
        do_delete: function(url, data, _config) {
            var config = _config || {};
            return this.addCallbacks(jQuery.ajax({
                type: "delete",
                url: this.apiServer + this.prepare(url, config),
                data: data,
                contentType: "application/json",
                headers: config.headers
            }), url, data, config);
        },
        do_submit: function(url, formData, _config) {
            var config = _config || {};
            return this.addCallbacks(jQuery.ajax({
                url: this.apiServer + this.prepare(url, config),
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                type: "POST",
                headers: config.headers
            }), url, formData, config);
        },
        do_open: function(url, data, config) {
            var query = URI.param(data);
            query = query ? ("?" + query) : "";
            return window.open(this.prepare(url, config) + query);
        },
        do_getFrame: function(url, data, config) {
            var query = URI.param(data);
            query = query ? ("?" + query) : "";
            var dff = jQuery.Deferred();
            var $iFrame = jQuery('<iframe src="' + this.prepare(url, config) + query + '"></iframe>');
            jQuery('body').append($iFrame);
            $iFrame[0].onload = function() {
                window.setTimeout(function() {
                    $iFrame.remove();
                    dff.resolve();
                }, 500);
            }
            return dff.promise();
        },
        prepare: function(url, config) {
            url = (this.urlMap[url] || url);
            for (var i in config) {
                url = url.replace("{" + i + "}", config[i]);
            }
            return url;
        }
    };
});
