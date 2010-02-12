
var qrEl = document.getElementById('qr');
var sizeEl = document.getElementById('size');
var size = 1;

sizeEl.onchange=function(){
  var option=this.options[this.selectedIndex];
  var val = parseInt(option.value);
  if (val!=NaN) size=val;
};

function toggle(cellId) {
  var cell=document.getElementById(cellId);
  if (cell.className=="white") {
    cell.className="black";
  } else {
    cell.className="white";
  }
}

function go() {
  var text = document.getElementById("text").value;
  qrEl.innerHTML = qrcode(size,text);
}

qrEl.innerHTML = qrcode(size, "here comes qr!");




function qrcode(size,text) {
  var output = [];
  var qr;

  try {
    qr = new QRCode(size, QRErrorCorrectLevel.H);
  	qr.addData(text);
	  qr.make();
  } catch (x) {
    alert(x);
  }


	output.push("<table style='border-width: 0px; border-style: none; border-color: #0000ff; border-collapse: collapse;'>");

	for (var r = 0; r < qr.getModuleCount(); r++) {

	    output.push("<tr>");

	    for (var c = 0; c < qr.getModuleCount(); c++) {

	        if (qr.isDark(r, c) ) {
	        output.push("<td class=\"black\" id='cell"+r+"-"+c+"' onclick='toggle(\"cell"+r+"-"+c+"\")'/>");
	        } else {
	            output.push("<td class=\"white\" id='cell"+r+"-"+c+"' onclick='toggle(\"cell"+r+"-"+c+"\")'/>");
	        }

	    }

	    output.push("</tr>");

	}

	output.push("</table>");

  return output.join(" ");
}
