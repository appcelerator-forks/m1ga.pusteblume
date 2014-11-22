// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

Alloy.Globals.formatDate = function(date) {
    // formate date and return it
    //
    var dat = new Date(date);

    var h = dat.getHours();
    var m = dat.getMinutes();
    var d = dat.getDate();
    var mon = dat.getMonth()+1;
    if (h < 10)
        h = "0" + h;
    if (m < 10)
        m = "0" + m;
    if (d < 10)
        d = "0" + d;
    if (mon < 10)
        mon = "0" + mon;

    return h + ":" + m + " - " + d + "." + mon + "." + String(dat.getFullYear()).substr(2);
};

Alloy.Globals.replaceText = function(txt) {
    // replace names
    var match = /@{(.[^;]*);(.[^}]*)}/ig;
    txt = txt.replace(match, "$1");

    //replace links
    match = /\[(.[^\]]*)\]\((.[^\)]*)\)/ig;
    txt = txt.replace(match, "<a href='$2'>$1</a>");

    //replace hashtags
    match = /#(\w+)/ig;
    txt = txt.replace(match, "<a href='pusteblume:$1'>#$1</a>");

    //replace headline tags
    match = /(#+ )/ig;
    txt = txt.replace(match, "");

    match = /&quot;/ig;
    txt = txt.replace(match, "\"");

    match = /\n\n/ig;
    txt = txt.replace(match, "\n");

    match = /\n/ig;
    txt = txt.replace(match, "<br/>");

    match = /\(C\)/ig;
    txt = txt.replace(match, "©");
    match = /->/ig;
    txt = txt.replace(match, "→");
    match = /\:\)/ig;
    txt = txt.replace(match, "☺");
    match = /;\)/ig;
    txt = txt.replace(match, "😉");
    match = /\:\(/ig;
    txt = txt.replace(match, "😞");
    match = /\:D/ig;
    txt = txt.replace(match, "😃");

    match = /<3/ig;
    txt = txt.replace(match, "❤");
    return txt;

};
