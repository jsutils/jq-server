/**
 * Created by lalittanwar on 22/01/16.
 */

define({
  name: "jsutils.server",
  modules: ["jQuery"]
}).as(function(SERVER, jQuery) {

  var hardCahce = {};

  return {
    apiServer: bootloader.config().apiServer || "/data/",
    urlMap: {
      "newTaxClass": "taxengine-admin/taxclass",
      "taxClass": "taxengine-admin/taxclass/{code}",
      "taxClassCodes": "taxengine-admin/taxclass/codes",
      "destinations": "taxengine-admin/location/citystates"
    },
    get: function(url, data, _config) {
      return (function(self) {
        if (config && config.cache && hardCahce[url]) {
          return hardCahce[url];
        }
        var config = _config || {};
        hardCahce[url] = jQuery.ajax({
          type: "get",
          url : self.apiServer + self.prepare(url, config),
          data : data,
          contentType: "application/json",
          headers: config.headers
        });
        return hardCahce[url];
      })(this).then(function(resp) {
        return JSON.parse(JSON.stringify(resp));
      });
    },
    post: function(url, data, _config) {
      var config = _config || {};
      return jQuery.ajax({
        url: this.apiServer + this.prepare(url, config),
        data: JSON.stringify(data),
        contentType: "application/json",
        type: "post",
        headers: config.headers
      });
    },
    put: function(url, data, config) {
      return jQuery.ajax({
        url: this.apiServer + this.prepare(url, config),
        data: JSON.stringify(data),
        contentType: "application/json",
        type: "put",
        headers: config.headers
      });
    },
    prepare: function(url, config) {
      url = (this.urlMap[url] || url);
      for (var i in config) {
        url = url.replace("{" + i + "}", config[i]);
      }
      return url;
    },
    delete: function(url, data, _config) {
      var config = _config || {};
      return jQuery.ajax({
        type: "delete",
        url : this.apiServer + this.prepare(url, config),
        data : data,
        contentType: "application/json",
        headers: config.headers
      });
    }
  };
});
