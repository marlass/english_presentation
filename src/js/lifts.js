var request = new XMLHttpRequest();
request.open('GET', 'http://www.towerbridge.org.uk/lift-times/', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // Success!
    var resp = request.responseText;
    console.log(resp);
  } else {
    // We reached our target server, but it returned an error

  }
};

request.onerror = function() {
  // There was a connection error of some sort
};

request.send();