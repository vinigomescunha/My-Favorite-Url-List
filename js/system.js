function Url(favIconUrl, title, url) {
  this.favIconUrl = favIconUrl;
  this.title = title;
  this.url = url;
  return this;
}
var tabs = chrome.tabs;
var error = function (error) {
  console.error(error);
};

class SysStorage {
  /**
   * @return Promise
   * @param {*} data 
   */
  constructor() {
    this.sync = chrome.storage.sync;
  }
  set(data) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.sync.set({
        'key': data
      }, function () {
        if (chrome.runtime.error) {
          reject('set error');
        } else {
          resolve(true);
        }
      });
    });
  }
  /**
   * @return Promise
   */
  get() {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.sync.get('key', function (data) {
        if (chrome.runtime.error) {
          reject('get error');
        } else {
          resolve(data['key']);
        }
      });
    });
  }
  clear() {
    this.sync.clear();
  }
}
var storage = new SysStorage();