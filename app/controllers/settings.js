function registerService() {
    // register service
    var intent = Titanium.Android.createServiceIntent({
        url : 'service_fetch.js'
    });

    var t = 10;
    if (parseFloat($.tf_interval.value) > 0) {
        t = parseFloat($.tf_interval.value);
    }
    intent.putExtra('interval', t * 60 * 1000);
    secs = null;

    if (Ti.Android.isServiceRunning(Ti.Android.createServiceIntent({
        url : "service_fetch.js"
    }))) {
        Ti.API.info("service running");
    } else {
        Ti.API.info("service NOT running");
        Titanium.Android.startService(intent);
        Ti.API.info("service started");

    }
}

function deleteService() {
    // remove service
    var intent = Ti.Android.createServiceIntent({
        url : "service_fetch.js"
    });
    Ti.Android.stopService(intent);
}

function onClickServiceStart(e) {
    Ti.API.info("register");
    registerService();
}

function onClickServiceStop(e) {
    Ti.API.info("remove");
    deleteService();
}

function onClickClose(e) {
    $.settings.close();
}

$.lbl_service_start.addEventListener("click", onClickServiceStart);
$.lbl_service_stop.addEventListener("click", onClickServiceStop);
$.btn_close.addEventListener("click", onClickClose);

$.settings.open();
