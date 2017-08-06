/**
 * Class Config 
 * 
 */
class Config {
  /**
   * @description this method receive from event listener the file then set to storage
   * @param {*} evt 
   */
  import (event) {
    var reader = new FileReader();
    reader.onload = (function (reader) {
      return function () {
        var lines = reader.result.split('\n');
        var items = [];
        for (var i in lines) {
          if (lines[i].trim() !== "") {
            var line = lines[i].split(';');
            if (line.length === 3) {
              items.push(new Url(line[0], line[1], line[2]))
            }
          }
        }
        storage.set(items).then(function (info) {
          window.close();
        }).catch(error);
      }
    })(reader);
    reader.readAsText(event.target.files[0]);
  }
  export (event) {
    storage.get().then(function (data) {
      var csv = "data:text/csv;charset=utf-8,";
      data.forEach(function (item, index) {
        var values = [];
        Object.values(item).forEach(function (value, index_value) {
          values.push(value.replace(';', '_')); // replace csv ; 
        });
        csv += values.join(';') + "\n"
      });
      var link = document.createElement("a");
      link.setAttribute("href", encodeURI(csv));
      link.setAttribute("download", "my_favorite_url.csv");
      link.click();
    }).catch(error);

  }
  clear(event) {
    if (confirm('Delete all?')) {
      storage.clear();
      window.close();
    }
  }
};

var config = new Config();
document.getElementById('import').addEventListener('change', function (e) {
  config.import(e);
});
document.getElementById('download').addEventListener('click', function (e) {
  config.export(e);
});
document.getElementById('clear').addEventListener('click', function (e) {
  config.clear(e);
});