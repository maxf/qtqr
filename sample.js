var cellSize = 20; // size of a single cell in pixels


var qrEl = document.getElementById('qr');
var sizeEl = document.getElementById('size');
var size = 4;

sizeEl.onchange=function(){
  var option=this.options[this.selectedIndex];
  var val = parseInt(option.value);
  if (val!=NaN) size=val;
};

function toggle(cellId) {
  var cell=document.getElementById(cellId);
  if (cell.className.baseVal=="white") {
    cell.className.baseVal="black";
  } else {
    cell.className.baseVal="white";
  }
}

function go() {
  var text = document.getElementById("text").value;
  qrEl.innerHTML = qrcode(size,text);
}

//qrEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><circle cx="150" cy="100" r="50" /></svg>';

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


//	output.push("<table style='border-width: 0px; border-style: none; border-color: #0000ff; border-collapse: collapse;'>");

  var moduleCount = qr.getModuleCount();

	output.push("<svg xmlns='http://www.w3.org/2000/svg' width='"+cellSize*moduleCount+"px' height='"+cellSize*moduleCount+"px'>");


	for (var r = 0; r < moduleCount; r++) {

	    output.push("<g>");

	    for (var c = 0; c < moduleCount; c++) {
        output.push("<rect id='cell"+r+"-"+c+"' onclick='toggle(\"cell"+r+"-"+c+"\")' class='"+(qr.isDark(r,c)?"black":"white")+"' x='"+c*cellSize+"px' y='"+r*cellSize+"px' width='"+cellSize+"px' height='"+cellSize+"px'></rect>");

	    }

	    output.push("</g>");

	}

	output.push("</svg>");

  return output.join(" ");
}
