/*
Copyright 2011, Lightbox Technologies, Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

function Utility () {}

Utility.prototype.getDataValueArray = function(data) {
  var arr = [];
  var len = data.length;
  var i = -1;
  while(++i < len) {
    arr.push(data[i].n);
  }
  return arr;
};

 Utility.prototype.stringFormatComma = function(number) {
  s = number.toString();
  i = s.indexOf(".");
  if (i<1) {
    i=s.length;
  }
  while (i>3) {
    i-=3;
    j = s.charAt(i-1);
    if (j>="0" && j<="9") {
      s = s.substr(0,i) + "," + s.substr(i);
    }
  }
  return s;
}

Utility.prototype.stringFormatSize = function(number) {
  var suffixes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "XB", "ZB"]; 
  var ret;
  var i = 0;
  while (number > 1024) {
    number = number / 1024;
    ++i;
  }
  ret = Math.round(number*100)/100;
  ret += " ";
  ret += suffixes[i];
  return ret;
}

Utility.prototype.getSum = function(data) {
  var m = 0;
  var i = data.length;
  while(i--) {
    m += data[i].n;
  }
  return m;
}

Utility.prototype.getMax = function(data, roundTo) {
  if (roundTo == null || roundTo == 0 || roundTo == "") {
    roundTo = 100;
  }
  var m = 0;
  var i = data.length;
  while(i--) {
    m = Math.max(m, data[i].n);
  }
  if (m > roundTo)
    roundTo = m;
//m = Math.round((m+50)/100)*100; //round to 100
  m = Math.round((m+(roundTo/2))/roundTo)*roundTo;
  return m;
}

Utility.prototype.countObjects = function(obj) {
  var count = 0;
  for (var prop in obj) {
    ++count;
  }
  return count;
}

Utility.prototype.getGraphicsObjArray = function(obj) {
  var arr = [];
  for (var prop in obj) {
    var ct = obj[prop].length;
    if (ct == null || ct == "") {
      //arr.push({"a":prop,"n":this.countObjects(obj[prop])}); //uncomment to include video count
    }
    else {
      arr.push({"a":prop,"n":ct});
    }
  }
  return arr;
}

Utility.prototype.serializeObject = function(obj) {
  if (obj) {
	  var str = "";
    for (var prop in obj) {
	    str += prop + ",";
	  }
    str = str.substring(0, str.length-1);
	  return str;
	}
}

Utility.prototype.deserialize = function(queryString, start) {
	var qArr = queryString.split("&");
	if (qArr && (qArr.length>0)) {
	  var arr = [];
	  var qLen = qArr.length;
	  for (var i = 0; i < qLen; i++) {
	    arr.push(qArr[i].substr(start, qArr[i].search("=")-start));
	  }
	  return arr;
	}
}

Utility.prototype.getUrlParams = function() {
  var urlParams = {};
  var e,
      a = /\+/g,
      r = /([^&=]+)=?([^&]*)/g,
      d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
      q = window.location.search.substring(1);
  while (e = r.exec(q))
     urlParams[d(e[1])] = d(e[2]);
  return urlParams;
}

Utility.prototype.getLinksFromScores = function(scoresArr, devName) {
  var obj = {nodes:[],links:[]};
  obj.nodes.push({nodeName:devName, group:0});
  var sLen = scoresArr.length;
  var mult = 1;
  if (sLen < 5) mult = 4; //increase weight for small number of nodes
  for (var i = 0; i < sLen; i++) {
    obj.nodes.push({nodeName:scoresArr[i].a, group:1});
    obj.links.push({source:0, target:i+1, value:scoresArr[i].iif*mult});
  }
  return obj;
}

Utility.prototype.sortNumberAsc = function(a, b) {
	return a - b;
}

Utility.prototype.sortNumberDesc = function(a, b) {
	return b - a;
}

Utility.prototype.DownloadJSON2CSV = function(objArray, selArray)
{
	//this.deserialize(queryString, 1);
	//TODO: use selArray to only output selected items
  //TODO: this should probably build an array, then join, for better performance
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';
  arrLen = array.length;
  for (var i = 0; i < arrLen; i++) {
    var line = '';
    for (var index in array[i]) {
      line += "\"" + String(array[i][index]).replace(/\x22/g, "\"\"") + '\",';
    }
    line.slice(0,line.Length-1); 
    str += line + '\r\n';
  }
  window.open("data:text/csv;charset=utf-8," + escape(str));
}

Utility.prototype.htmlSafeString = function(s)
{
  return String(s).replace(/&(?!\w+([;\s]|$))/g, "&amp;").replace(/\x3C/g, "&lt;").replace(/\x3E/g, "&gt;");
}

Utility.prototype.findObjectByName = function(data, str) {
  if (data) {
    var arr = [];
    var len = data.length;
    var i = -1;
    while(++i < len) {
      if (data[i].a == str) {
        return data[i];
      }
    }
  }
  return [];
};

Utility.prototype.findObjectByIndex = function(data, index) {
  if (data) {
    var arr = [];
    var len = data.length;
    var i = -1;
    while(++i < len) {
      if (data[i].a == index) {
        return data[i];
      }
    }
  }
  return [];
};

Utility.prototype.getFileNameFromPath = function(str, delim) {
	var filename = str;
	filename = filename.substring(filename.lastIndexOf(delim) + 1, filename.length);
	return filename;
}

Utility.prototype.getFileNameFromUrl = function(url) {
	var filename = url;
  if (filename == null || filename == "") {
    filename = document.location.href;
  }
	filename = filename.substring(0, (filename.indexOf("#") == -1) ? filename.length : filename.indexOf("#"));
	filename = filename.substring(0, (filename.indexOf("?") == -1) ? filename.length : filename.indexOf("?"));
	filename = filename.substring(filename.lastIndexOf("/") + 1, filename.length);
	return filename;
}

Utility.prototype.menuClick = function(e) {
  location.href = $(this).attr("link");
}

Utility.prototype.buildMenu = function(list, targetDivId) {
	mlen = list.length;
	var fileName = Util.getFileNameFromUrl();
  var items = [];
  var i = 0;
  while(i < mlen) {
    var line = '<div id="menu' + i + '" class="ui-widget rpt-top-menu dropShadow ';
    if (fileName == Util.getFileNameFromUrl(list[i].link)) {
    	line += ' ui-widget-menu-active ';
  	}
  	else {
  		line += ' ui-widget-menu-plain ';
  	}
    line += ' ui-corner-bottom" link="' + list[i].link + '"><a href="#">' + list[i].a + '</a></div>';
    items.push(line);
    ++i;
  }
  $('#' + targetDivId).html(items.join(''));
	$(".rpt-top-menu").bind('click', this.menuClick);
  return mlen;
}
