function pick() {
    var q = $("#q").val();
    if (q) {
        var all = $(".m-itemlist .items .item");

        var text = [];
        all.each(function () {
            if ($(this).find(".icon .icon-service-tianmao,.icon .icon-service-jinpaimaijia").size() > 0) {
                var a = $(this).find(" .title a");
                //text.push(a.text().trim());
                var href = a.attr('href');
                if (href.indexOf("//") == 0) {
                    href = "https:" + href;
                }
                text.push(href);
            }
        });
        //var h = "<textarea style='width:100%' rows='10'>" + text.join("\n") + "</textarea>";
        // document.getElementById("mainsrp-related").innerHTML = h;

        //console.log("========do pick=========");

        chrome.extension.sendRequest({
            msg: 'copy',
            text: text.join("\n")
        }, function (response) {
            //console.log(response.farewell);
            if (response.success) {
                alert("复制成功。");
            } else {
                alert("复制失败。");
            }

        });
    }
}

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        // console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if (request.msg == "pick") {
            pick();
            sendResponse({farewell: "goodbye"});
        }
        else {
            sendResponse({}); // snub them.
        }
    });
