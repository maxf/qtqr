var size = 4; // QR code size (version)
var cellSize = 15; // size of a single cell in pixels
var imageURL;
var displayImage;

var qrEl = document.getElementById('qr');
var sizeEl = document.getElementById('size');
var cellSizeEl = document.getElementById('cellSize');
var toggleImageEl = document.getElementById('toggleImage');

var imageGrabbed;

sizeEl.onchange=function(){
  var option=this.options[this.selectedIndex];
  var val = parseInt(option.value);
  if (val!=NaN) size=val;
};

cellSizeEl.onchange=function(){
  var option=this.options[this.selectedIndex];
  var val = parseInt(option.value);
  if (val!=NaN) cellSize=val;
};

function toggleCell(cellId) {
  var cell=document.getElementById(cellId);
  if (cell.className.baseVal=="white") {
    cell.className.baseVal="black";
  } else {
    cell.className.baseVal="white";
  }
}

function go() {
  var text = document.getElementById("text").value;
  imageURL = document.getElementById("imageURL").value;
  displayImage = document.getElementById('toggleImage').checked;
  qrEl.innerHTML = qrcode(size,text);
}

var originalText = "here comes qr!";
document.getElementById("text").value=originalText;
qrEl.innerHTML = qrcode(size, originalText);



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


  var moduleCount = qr.getModuleCount();

	output.push("<svg xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' width='"+cellSize*moduleCount+"px' height='"+cellSize*moduleCount+"px'>");
  output.push(hazardousAreas(cellSize, moduleCount));

	for (var r = 0; r < moduleCount; r++) {
	    output.push("<g>");
	    for (var c = 0; c < moduleCount; c++) {
        output.push("<rect id='cell"+r+"-"+c+"' onclick='toggleCell(\"cell"+r+"-"+c+"\")' class='"+(qr.isDark(r,c)?"black":"white")+"' x='"+c*cellSize+"px' y='"+r*cellSize+"px' width='"+cellSize+"px' height='"+cellSize+"px'></rect>");
	    }
	    output.push("</g>");
	}

  if (displayImage && imageURL && imageURL!="") {
    output.push('<image id="image" onmousemove="imageMove(evt)" onmousedown="imageGrab(evt)" onmouseup="imageRelease(evt)"  x="10px" y="10px" width=\"100px\" height=\"100px\" xlink:href="'+imageURL+'"></image>');
  }

	output.push("</svg>");
  return output.join(" ");
}

var origX, origY;

function imageGrab(e) {
  imageGrabbed = true;
  origX = e.clientX;
  origY = e.clientY;
}

function imageRelease(e) {
  imageGrabbed = false;
}

function imageMove(e) {
  if (imageGrabbed) {
    document.getElementById("message").innerHTML = "> "+e.clientX+", "+e.clientY;
    document.getElementById("image").setAttribute("x",e.clientX - origX);
    document.getElementById("image").setAttribute("y",e.clientY - origY);
  }
}

/*
 * Mark potentially dangerous areas to tamper with
 */
function hazardousAreas(cellSize, moduleCount) {
  var output = [];
  // Finder patterns
  output.push("<g id='hazards'>");
  output.push("<rect id='finder-top-left' x='0px' y='0px' width='"+8*cellSize+"px' height='"+8*cellSize+"px' class='hazard'></rect>");
  output.push("<rect id='finder-top-right' x='"+(cellSize*moduleCount-8*(cellSize))+"px' y='0px' width='"+8*cellSize+"px' height='"+8*cellSize+"px' class='hazard'></rect>");
  output.push("<rect id='finder-bottom-right' y='"+(cellSize*moduleCount-8*(cellSize))+"px' x='0px' width='"+8*cellSize+"px' height='"+8*cellSize+"px' class='hazard'></rect>");
  output.push("</g>");
  return output.join(" ");
};