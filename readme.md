#jsutils.server

```bash
bower install jsutils-server --save
```

####Define `DataService` module to use for any server calls
```javascript
define({
    module : "DataService",
    extend : "jsutils.server"
}).as(function(DataService){
    return {
        apiServer: "/data/",
        urlMap : {
            "newTaxClass": "taxengine-admin/taxclass",
            "taxClass": "taxengine-admin/taxclass/{code}",
            "taxClassCodes": "taxengine-admin/taxclass/codes",
            "destinations": "taxengine-admin/location/citystates"
        },
        _done_: function(response, url, data, _config) {

        },
        _fail_: function(e, url, data, _config) {

        },
        _always_: function(e, url, data, _config) {

        }
    }
});

```

To use in your any module
```javascript
define({
    module : "MyModule",
    using : ["DataService"]
}).as(function(MyModule,DataService){
    return {
        _something_ : function(){
            DataService.get("taxClass",{},{ code : 123 }).done(function(resp){
                console.error("response==",resp)
            })
        }
    }
});

```
