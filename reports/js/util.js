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

Utility.prototype.getMax = function(data) {
  var m = 0;
  var i = data.length;
  while(i--) {
    m = Math.max(m, data[i].n);
  }
  m = Math.round((m+50)/100)*100;
  return m;
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

Utility.prototype.sortNumberAsc = function(a, b) {
	return a - b;
}

Utility.prototype.sortNumberDesc = function(a, b) {
	return b - a;
}

Utility.prototype.DownloadJSON2CSV = function(objArray, queryString)
{
	//this.deserialize(queryString, 1);
	//TODO: use queryString to only output selected items
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

Utility.prototype.getFileName = function() {
	var filename = document.location.href;
	filename = filename.substring(0, (filename.indexOf("#") == -1) ? filename.length : filename.indexOf("#"));
	filename = filename.substring(0, (filename.indexOf("?") == -1) ? filename.length : filename.indexOf("?"));
	filename = filename.substring(filename.lastIndexOf("/") + 1, filename.length);
	return filename;
}

Utility.prototype.menuClick = function(e) {
  location.href = $(this).attr("link");
}

Utility.prototype.menuMouseOver = function(e) {
  $(this)
  .css({ background: '#aeb6f4', cursor: 'pointer' });
}

Utility.prototype.menuMouseOut = function(e) {
  $(this)
  .css({ background: '' });
}

Utility.prototype.buildMenu = function(list, id) {
	mlen = list.length;
	var fileName = Util.getFileName();
  var items = [];
  var i = 0;
  while(i < mlen) {
    var line = '<div id="menu' + i + '" class="ui-widget rpt-top-menu ';
    if (fileName == list[i].link) {
    	line += ' ui-widget-menu-active ';
  	}
  	else {
  		line += ' ui-widget-menu-plain ';
  	}
    line += ' ui-corner-bottom" link="' + list[i].link + '"><a href=#>' + list[i].a + '</a></div>';
    items.push(line);
    ++i;
  }
  $('#' + id).html(items.join(''));
	$(".rpt-top-menu").bind('mouseover', this.menuMouseOver);
	$(".rpt-top-menu").bind('mouseout', this.menuMouseOut);
	$(".rpt-top-menu").bind('click', this.menuClick);
  return mlen;
}