var cmid;
var cm_clickHandler = function(clickData, tab) {
    var newURL = "https://launchpad.support.sap.com/#/notes/" + clickData.selectionText;
	chrome.tabs.create({ url: newURL });
};
var cm_clickHandler_NaN = function(clickData, tab) {
      var newURL = "https://launchpad.support.sap.com/#/solutions/notes/?q=" + clickData.selectionText;
		chrome.tabs.create({ url: newURL });
};


chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.request === 'updateContextMenu') {
		var type = msg.selection;
        if (type == '') {
            // Remove the context menu entry
            if (cmid != null) {
                chrome.contextMenus.remove(cmid);
                cmid = null; // Invalidate entry now to avoid race conditions
            } // else: No contextmenu ID, so nothing to remove
        } 
		else { // Add/update context menu entry
            var options = {
                title: "Open note '%s'",
                contexts: ['selection'],
                onclick: cm_clickHandler
            };
			var options_NaN = {
                title: "Search '%s' in SAP Support",
                contexts: ['selection'],
                onclick: cm_clickHandler_NaN
            };
            if (cmid != null) {
                if(isNaN(type)){
					chrome.contextMenus.update(cmid, options_NaN);
				}
				else{
					chrome.contextMenus.update(cmid, options);
				}
            } 
			else {
                if(isNaN(type)){
					cmid = chrome.contextMenus.create(options_NaN);
				}
				else{
					cmid = chrome.contextMenus.create(options);
				}
                
            }
        }
    }
});

/*
var xhr = new XMLHttpRequest();
function request()
{
	xhr.open('GET', "https://launchpad.support.sap.com/services/xse/sap/ags/support_portal/search/services/search_notes.xsjs?q=Dump+in+BPM+Data+collection+job+BPM+Data&responsesize=10", true);
	xhr.setRequestHeader("Authorization", "Basic " + btoa("S0005482142:W%w.x&0O"));
	xhr.withCredentials = true;
	xhr.send();
	xhr.onreadystatechange = processRequest;
}
function processRequest(e) {
    if (xhr.readyState == 4) {
        var response = JSON.parse(xhr.responseText);
    }
}*/