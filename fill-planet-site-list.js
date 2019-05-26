  function receive_request() {
    var ul = document.getElementById("sitelist");

    pinpoints_xml = this.responseXML;

    if (window.location.pathname.indexOf(".") > 0) {
        planet_name = window.location.pathname.slice(1, window.location.pathname.indexOf("."));
    } else {
        planet_name = window.location.pathname.slice(1);
    }

    //resolver = pinpoints_xml.createNSResolver(pinpoints_xml.ownerDocument == null ? pinpoints_xml.documentElement : pinpoints_xml.ownerDocument.documentElement);

    function resolver() {
        return "http://www.opengis.net/kml/2.2";
    }
    var xpath_expression = "//*[local-name()='Placemark']";

    var placemarks_it = pinpoints_xml.evaluate(xpath_expression, pinpoints_xml, resolver, XPathResult.ANY_TYPE, null);

    var placemark = placemarks_it.iterateNext();
    if (! placemark) { console.log("your xpath is wrong! Expression >" + xpath_expression + "<.  And the doc:"); console.log(pinpoints_xml); }
    while (placemark) {
      try {
        var site_name = placemark.getElementsByTagName("name")[0].textContent;
        var orbit_name = placemark.getElementsByTagName("description")[0].textContent;
        var lonlatalt = placemark.getElementsByTagName("coordinates")[0].textContent.split(",");
        var style = placemark.getElementsByTagName("styleUrl")[0].textContent.substring(1);
      } catch(exc) {
        console.log(placemark);
      } 

      if (orbit_name.toLowerCase() == planet_name.toLowerCase()) {

        var li = document.createElement("li");
        var a = document.createElement("a");
        var span = document.createElement("span");
        var data = document.createElement("data");
        a.setAttribute("href", "/map#loc"+lonlatalt[1]+","+lonlatalt[0]); 
        if ("onhashchange" in window) {
          a.setAttribute("target", "map"); 
        }
        a.appendChild(document.createTextNode(site_name));
        li.appendChild(a);
        span.appendChild(document.createTextNode(" at "));
        span.setAttribute("class", "description");
        data.appendChild(document.createTextNode(""+lonlatalt[1] + ", " + lonlatalt[0]));
        data.setAttribute("value", lonlatalt);
        span.appendChild(data);
        li.appendChild(span);
        li.setAttribute("class", style);
        ul.appendChild(li);
      }

      placemark = placemarks_it.iterateNext();
    }

  }

  var pinpoints_url = "mapdata/pinpoints.kml";
  var xmlhr = new XMLHttpRequest();
  xmlhr.onload = receive_request;
  xmlhr.open("get", pinpoints_url, true);
  xmlhr.send();
