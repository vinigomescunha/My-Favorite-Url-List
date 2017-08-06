"use strict";
chrome
  .runtime
  .onInstalled
  .addListener(
    function (i) {}
  ),
  chrome
  .tabs
  .onUpdated
  .addListener(
    function (a) {
      chrome.pageAction.show(a);
    }
  );
chrome.runtime.onMessage.addListener(function (request) {
  if (request.type === 'request_password') {
    chrome.tabs.create({
      url: chrome.extension.getURL('html/config.html'),
      active: false
    }, function (tab) {
      var w = 450;
      var h = 250;
      var left = (screen.width - w) - 100;
      var top = 100;
      chrome.windows.create({
        tabId: tab.id,
        type: 'popup',
        focused: true,
        'width': w,
        'height': h,
        'left': left,
        'top': top
      });
    });
  }
});