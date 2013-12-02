var args = arguments[0] || {};

function onClickRegister(e) {
    getToken();
}

function onToken(e) {
    var m = /.*authenticity_token.*value=\"(.*)\"/;
    var res = String(e).match(m);
    Ti.App.Properties.setString("token", res[1]);

    require("/api").createAPI({
        type : "POST", url : "/users", success : onCreate, error : onCreateError, token : false, noJSON : true, parameter : {
            "utf8" : "✓", "user[username]" : $.username.value, "user[email]" : $.email.value, "user[password]" : $.password.value, "user[password_conformation]" : $.password_repeat.value, "commit" : "Continue", "authenticity_token" : Ti.App.Properties.getString("token")
        }
    });

}

function onCreate(e) {
    var m = /https:\/\//ig;
    var domain = String($.server.value).replace(m, "");
    args.username.value = $.username.value + "@" + domain;
    Ti.API.info($.username.value + "@" + domain);
    Ti.App.Properties.setString("username",$.username.value + "@" + domain);
    
    $.register.close();
}

function onCreateError(e) {

}

function onTokenError(e) {

}

function getToken() {
    // get token
    //

    require("/api").createAPI({
        type : "GET", url : "/users/sign_up", success : onToken, error : onTokenError, noJSON : true
    });
}

var pods = ["https://pod.geraspora.de", "https://diasp.eu", "https://nerdpol.ch", "https://despora.de", "https://poddery.com"];
var server = pods[Math.floor(Math.random() * pods.length)];
$.server.value = server;
Ti.App.Properties.setString("pod", server);

$.btn_create.addEventListener("click", onClickRegister);
