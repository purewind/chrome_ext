(function () {

    const SKIP_SNIFFER_SIGNS = [
        'ustream.tv\/([^.]*)',
        'twitch.tv\/([^.]*)',
        'periscope.tv\/([^.]*)',
        'break.com\/video\/([^.]*)',
        'http:\/\/(www\.)?dailymotion(\.co)?\.([^\.\/]+)\/',
        'www\.facebook\.com\/(.*)',
        'metacafe\.com\/watch\/(.*)',
        "vk.com",
        "hulu.com",
        "cnn.com",
        "cbsnews.com"
    ];

    var self = this;

    function getHeaderValue(name, data) {
        name = name.toLowerCase();
        for (var i = 0; i != data.responseHeaders.length; i++) {
            if (data.responseHeaders[i].name.toLowerCase() == name) {
                return data.responseHeaders[i].value;
            }
        }
        return null;
    }

    this.isMedia = function (data) {
        return false;
    }

    var callback = function (data) {

        if (!data || data.tabId < 0)
            return false;

        chrome.tabs.get(data.tabId, function (tab) {

            if (chrome.runtime.lastError) {
                //console.log(chrome.runtime.lastError.message);
            }
            else if (!tab) {
                console.log(data);
            }
            else {
                var tabInfo = tab;
                data.tab = tabInfo;
            }

        });
    };

    var opt_filter = {
        urls: ["<all_urls>"]
    };

    var opt_extraInfoSpec = ["responseHeaders"];

    chrome.webRequest.onResponseStarted.addListener(callback, opt_filter, opt_extraInfoSpec);

    chrome.webRequest.onBeforeRequest.addListener(function (data) {

            //if (data.method == "POST") {
            if (!data || data.tabId < 0)
                return false;

            chrome.tabs.get(data.tabId, function (tab) {
                if (chrome.runtime.lastError) {
                    //console.log(chrome.runtime.lastError.message);
                }
                else if (!tab) {
                    console.log(data);
                }
                else {
                    var tabInfo = tab;
                    data.tab = tabInfo;
                    if (!tabInfo.url) return false;

                    if (data.url.indexOf("/player/getFlvPath") > 0) {
                        console.log(data.url);
                    }

                    if (data.url.indexOf(".flv") > 0) {
                        console.log(data.url);
                    }
                }
            });
            //}

        },
        {urls: ["<all_urls>"]},
        ["requestBody"]
    );

    chrome.webRequest.onBeforeRequest.addListener(function (data) {
        if (!data || data.tabId < 0)
            return false;

    }, {}, ["responseBody"]);
    console.log("init");

})();