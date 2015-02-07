var args = arguments[0] || {};
var data = [];

var getStream = args.getStream;
var showImage = args.showImage || null;
var getMore = args.getMore || null;
var showImages = Ti.App.Properties.getBool("showImages");

function onClickLink(e) {
    //Ti.API.info(e.url);
    if (e.url) {
        if (e.url.substr(0, 10) == "pusteblume") {
            // handle hashtags
            Ti.API.info("hashtag");
        } else {
            // external link
            Ti.Platform.openURL(e.url);
        }
    } else {
        // click the textfield but not a link
        //Ti.API.info("show comments");
        onClickItem({
            source: {
                name: "",
                row: {
                    id: e.source.rowID
                }
            }
        });
    }
}

$.setData = function(d) {
    data = d;

    var mainData = [];

    for (var i = 0; i < data.length; ++i) {
        var row = Ti.UI.createTableViewRow({
            height: Ti.UI.SIZE,
            layout: "vertical"
        });
        var top = $.UI.create("View", {
            height: Ti.UI.SIZE,
            left: 0,
            right: 0,
            top: 0
        });


        var img = $.UI.create('ImageView', {
            classes: ["img_author"],
            image: (showImages)?data[i].icon:"",
            author: data[i].author,
            name: "userimage"
        });

        var lbl_author = $.UI.create('Label', {
            classes: ["txt_author"],
            text: data[i].author
        });

        var lbl_text = $.UI.create('Label', {
            classes: ["lbl_text"],
            html: Alloy.Globals.replaceText(data[i].text),
            left: 75,
            top: 34,
            height: Ti.UI.SIZE
        });

        var imageRow = null;
        var lastImage = 0;

        if (showImages && data[i].photos && data[i].photos.length > 0) {
            imageRow = $.UI.create("View", {
                bottom: 0,
                left: 75,
                right: 0,
                layout: "horizontal",
                height: Ti.UI.SIZE
            });

            for (var pPos = 0; pPos < data[i].photos.length; ++pPos) {
                if (lastImage != data[i].photos[pPos].guid) {
                    var img_post = $.UI.create("ImageView", {
                        dataPos: i,
                        image: data[i].photos[pPos].sizes.small,
                        width: 50,
                        height: 50,
                        borderWidth: 1,
                        right: 0,
                        borderColor: "#444"
                    });
                    img_post.addEventListener("click", onClickImage);
                    imageRow.add(img_post);
                }
                lastImage = data[i].photos[pPos].guid;
            }
        }

        var pubimg = "";
        var pubtxt = "public";
        if (!data[i].isPublic) {
            pubimg = "";
            pubtxt = "private";
        }

        var img_public = Ti.UI.createLabel({
            text: pubimg,
            left: 6,
            width: 10,
            height: 10,
            top: 70,
            font: {
                fontFamily: "FontAwesome",
                fontSize: 10
            }
        });
        var lbl_public = $.UI.create('Label', {
            classes: ["txt_small"],
            text: pubtxt,
            top: img_public.top - 4,
            left: 20,
            width: 35,
            textAlign: "left"
        });

        pubimg = null;
        pubtxt = null;

        var lbl_date = $.UI.create('Label', {
            classes: ["txt_date"],
            text: data[i].date,
            top: lbl_author.top + 1
        });

        top.add(img);
        top.add(lbl_author);
        top.add(lbl_date);
        top.add(lbl_text);

        if (data[i].type != "comments") {

            var img_likes = Ti.UI.createLabel({
                text: "",
                left: img_public.left,
                width: 12,
                height: 10,
                top: img_public.top + 20,
                font: {
                    fontFamily: "FontAwesome",
                    fontSize: 10
                }
            });

            var lbl_likes = $.UI.create('Label', {
                classes: ["txt_small"],
                text: data[i].like_count,
                top: img_likes.top - 4,
                left: lbl_public.left,
                width: 20,
                textAlign: "left"
            });

            var img_comments = Ti.UI.createLabel({
                text: "",
                width: 10,
                height: 10,
                top: img_likes.top + 20,
                left: img_public.left,
                font: {
                    fontFamily: "FontAwesome",
                    fontSize: 10
                }
            });

            var lbl_comments = $.UI.create('Label', {
                classes: ["txt_small"],
                text: data[i].comment_count,
                top: img_comments.top - 4,
                left: lbl_public.left,
                width: 20,
                textAlign: "left"
            });

            var spacer = Ti.UI.createView({
                left: 0,
                top: 0,
                height: 125,
                width: 1,
                touchEnabled: false
            });

            top.add(img_comments);
            top.add(lbl_comments);
            top.add(img_public);
            top.add(lbl_public);
            top.add(img_likes);
            top.add(lbl_likes);
            top.add(spacer);

            row.add(top);

            if (imageRow) {
                row.add(imageRow);
            }
        }

        row.id = i;

        if (data.append === true) {
            // append rows
            $.tbl.appendRow(row);
        } else {
            // add to array
            mainData.push(row);
        }

        img.addEventListener("click", onClickUserImage);
    }

    if (mainData.length > 0) {
        // set data if array is not empty
        $.tbl.data = mainData;
    }
    mainData = null;
};

$.appendData = function(d) {
    // add elements to table
    d["append"] = true;
    this.setData(d);
};

function onClickUserImage(e) {
    // click contact image
    e.bubbles = false;
    e.cancelBubble = true;
    alert("TODO: Display page of " + e.source.author);
}

function onClickImage(e) {
    // click on a photo
    e.bubbles = false;
    e.cancelBubble = true;
    if (showImage)
        showImage(data[e.source.dataPos].photos);
}

function onShowMore(e) {
    // fold in/out the selected row
    if ($.tbl.data[0].rows[e.source.rowID].height != e.source.fullHeight) {
        $.tbl.data[0].rows[e.source.rowID].height = e.source.fullHeight;
        $.tbl.updateRow(e.source.rowID, $.tbl.data[0].rows[e.source.rowID]);
    } else {
        $.tbl.data[0].rows[e.source.rowID].height = 160;
        $.tbl.updateRow(e.source.rowID, $.tbl.data[0].rows[e.source.rowID]);
    }
}

function onClickItem(e) {
    // clicked an item
    if (e.source.name != "more" && e.source.name != "userimage") {
        if (e.row || e.source.row) {
            var id = null;
            if (e.row) {
                id = e.row.id;
            } else if (e.source.row) {
                id = e.source.row.id;
            }
            if (id !== null) {
                var cont = Alloy.createController("comments", {
                    id: data[id].id,
                    data: data[id],
                    refesh: getStream
                }).getView();
                cont.open();
            }
        }
    }
}

function onScroll(e) {
    if (e.firstVisibleItem > e.totalItemCount - 10) {

        $.btn_more.show();
    }
}

function onClickMore(e) {
    $.btn_more.hide();
    if (getMore) {
        getMore();
    }
}

if (args.click) {
    // show refresh for normal list first
    $.btn_more.addEventListener("click", onClickMore);
}
$.tbl.addEventListener("click", onClickItem);
$.tbl.addEventListener("scroll", onScroll);
