var args = arguments[0] || {};
var data = [];

$.username.value = Ti.App.Properties.getString("username");

function getToken() {
    // get token
    //
    require("/api").createAPI({
        type: "GET",
        url: "/users/sign_in",
        success: onToken,
        error: onTokenError,
        noJSON: true
    });
}

function onToken(e) {
    // extract token
    //
    var m = /.*authenticity_token.*value=\"(.*)\"/;
    var res = String(e).match(m);
    Ti.App.Properties.setString("token", res[1]);

    $.waiting.message = L("login");
    require("/api").createAPI({
        type: "POST",
        url: "/users/sign_in",
        success: onLogin,
        error: onLoginError,
        login: true,
        noJSON: true,
        parameter: {
            "utf8": "✓",
            "user[username]": $.username.value.split("@")[0],
            "user[password]": $.password.value,
            "commit": "Sign in",
            "user[remember_me]": 1,
            "authenticity_token": Ti.App.Properties.getString("token")
        }
    });
}

function onTokenError(e) {
    alert(L("noToken"));
    $.waiting.hide();
    $.btn_login.enabled = true;
}

function onClickLogin(e) {

    if ($.username.value != "" && $.password.value != "") {

        if (String($.username.value).indexOf("@") > 0) {
            // parse name and pod

            Ti.App.Properties.setString("pod", "https://" + $.username.value.split("@")[1]);

            getToken();
            $.waiting.message = L("getToken");
            $.waiting.show();
            $.password.blur();
            $.username.blur();
            $.btn_login.enabled = false;
        } else {
            alert(L("setUsername"));
        }
    } else {
        alert(L("fieldEmpty"));
    }
}

function onLogin(e) {
    $.waiting.hide();
    Ti.App.Properties.setString("username", $.username.value);
    Ti.App.Properties.setBool("loggedIn", true);
    args.getToken();
    args.getStream();
    args.getUserInfo();
    $.login.close();
    $.btn_login.enabled = true;
}

function onLoginError(e) {
    $.waiting.hide();
    $.btn_login.enabled = true;
    Ti.App.Properties.setBool("loggedIn", false);
    alert(L("error"));
}

function onClickRegister(e) {
    var win = Alloy.createController("register", {
        username: $.username
    }).getView();
    win.open();
}

$.btn_login.addEventListener("click", onClickLogin);
//$.btn_register.addEventListener("click", onClickRegister);
$.login.open();
