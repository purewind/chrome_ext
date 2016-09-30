function startPick(info, tab) {
    chrome.tabs.sendRequest(tab.id, {
        msg: 'pick'
    });
}

var selection = chrome.contextMenus.create({"title": "获取宝贝", "contexts": ["page"], "onclick": startPick});


Clipboard = {
    /**
     * Ecrit la chaîne passée en paramètre dans le presse papier (fonction "Copier")
     *
     * On a pas accès au presse papier via l'API Google Chrome,
     * donc l'astuce consiste à placer le texte à copier dans un <textarea>,
     * de sélectionner tout le contenu de ce <textarea>, et de copier.
     *
     * @param String str Chaîne à copier dans le presse-papier
     * @param Bool extended_mime Indique si on doit copier le type MIME text/html en plus du texte brut
     */
    write: function (str) {
        if (str == '' || str == undefined) {
            str = '<empty>';
        }

        // Copie par défaut, via le clipboardBuffer
        clipboardBuffer.val(str);
        clipboardBuffer.select();

        // Copie via l'API (clipboardData)
        var oncopyBackup = document.oncopy;
        document.oncopy = function (e) {
            // Si on n'utilise pas le type MIME html, on sort tout de suite pour laisser la main à la méthode par défaut : clipboardBuffer
            if (typeof extended_mime == "undefined" || extended_mime != true) {
                return;
            }
            e.preventDefault();
            e.clipboardData.setData("text/html", str);
            e.clipboardData.setData("text/plain", str);
        };
        document.execCommand('copy');
        document.oncopy = oncopyBackup;
    },

    /**
     * Retourne le contenu du presse papier (String)
     */
    read: function () {
        clipboardBuffer.val('');
        clipboardBuffer.select();
        document.execCommand('paste')
        return clipboardBuffer.val();
    }
};

Action = {
    copy: function (opt) {
        chrome.tabs.getSelected(opt.window.id, function (tab) {
            chrome.tabs.sendRequest(tab.id, {
                msg: 'pick'
            });
        });
    }
}
/**
 * Raccourci clavier
 */
chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
        case "copy":
            chrome.windows.getCurrent(function (win) {
                Action.copy({window: win});
            });
            break;
    }
});


chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        //console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if (request.msg == "copy") {
            Clipboard.write(request.text);
            sendResponse({success: true});
        }
        else {
            sendResponse({}); // snub them.
        }
    });


jQuery(function ($) {
    // Au chargement de la page, on créé une textarea qui va servir à lire et à écrire dans le presse papier
    clipboardBuffer = $('<textarea id="clipboardBuffer"></textarea>');
    clipboardBuffer.appendTo('body');
});