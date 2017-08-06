class Popup {
  render() {
    storage.get().then(function (data) {
      var template = Hogan.compile("<div class='item'><img src='{{favIconUrl}}' /><a class='openurl' href='{{url}}'>{{title}}</a></div>");
      var layer = document.getElementById('layer');
      layer.innerHTML = '';
      for (var i in data) {
        layer.insertAdjacentHTML('beforeend', template.render(data[i]));
      }
    }).catch(error);
  }
  addUrl(event) {
    var self = this;
    var notFound;
    tabs.getSelected(null, function (tab) {
      storage.get().then(function (data) {
        var urls = data && Array.isArray(data) ? data : [];
        notFound = urls.findIndex(function (u) {return u.url === tab.url;}) === -1;
        if (notFound) {
          urls.push(new Url(tab.favIconUrl, tab.title, tab.url));
        }
        storage.set(urls).then(function (info) {
          self.render();
        }).catch(error);
      }).catch(error);
    });
  }
  removeUrl(event) {
    var self = this;
    tabs.getSelected(null, function (tab) {
      storage.get().then(function (data) {
        var index = data.findIndex(function (u) {
          return u.url === tab.url;
        });
        if (index !== -1) {
          data.splice(index, 1);
          storage.set(data).then(function (info) {
            self.render();
          }).catch(error);
        }
      }).catch(error);
    });
  }
  openUrl(evevt) {
    var target = event.target;
    if (target.className === 'openurl') {
      tabs.getSelected(null, function (tab) {
        tabs.update(tab.id, {
          url: target.href
        });
      });
    }
  }
  openConfig(event) {
    chrome.runtime.sendMessage({
      type: 'request_password'
    });
  }
};

var popup = new Popup();
popup.render();
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('addurl').addEventListener('click', function (e) {
    popup.addUrl(e);
  });
  document.getElementById('removeurl').addEventListener('click', function (e) {
    popup.removeUrl(e);
  });
  document.getElementById('config').addEventListener('click', function (e) {
    popup.openConfig(e);
  });
  /**
   * monitore click for the element class, id or another attribute without block
   */
  document.body.addEventListener("click", function (e) {
    popup.openUrl(e);
  });
});
