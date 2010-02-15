var size = 4; // QR code size (version)
var cellSize = 15; // size of a single cell in pixels
var imageSizeMagnification = 1;

var qrEl = document.getElementById('qr');
var sizeEl = document.getElementById('size');
var cellSizeEl = document.getElementById('cellSize');
var toggleImageEl = document.getElementById('toggleImage');
var imageURLEl = document.getElementById('imageURL');
var zoomEl = document.getElementById('zoom');
var imageSizeChangeEl = document.getElementById('imageSizeChange');
var imageURL = imageURLEl.value;
var displayImage = toggleImageEl.checked;
var startingCursorX, startingCursorY;
var imageOriginX=10, imageOriginY=10;
var imageEl;
var imageGrabbed=false;



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

function imageSizeChange() {
  var val = parseInt(zoomEl.value);
  if (parseInt(val) == NaN || val <= 0) val=1;
  var imageEl = document.getElementById("image");
  if (imageEl) {
    imageEl.setAttribute("transform","scale("+val+")");
    imageOriginX/=val; imageOriginY/=val;
    imageEl.setAttribute("x",imageOriginX);
    imageEl.setAttribute("y",imageOriginY);
  }
  imageSizeMagnification = val;
}

function toggleCell(cellId) {
  var cell=document.getElementById(cellId);
  if (cell.className.baseVal=="white") {
    cell.className.baseVal="black";
  } else {
    cell.className.baseVal="white";
  }
}

function toggleImage(evt) {
  if (toggleImageEl.checked) {
    imageURLEl.disabled = zoomEl.disabled = imageSizeChangeEl.disabled = false;
    document.getElementById("image").setAttribute("opacity","1");
  } else {
    imageURLEl.disabled = zoomEl.disabled = imageSizeChangeEl.disabled = true;
    document.getElementById("image").setAttribute("opacity","0");
  }
}

function go() {
  var text = document.getElementById("text").value;
  imageURL = document.getElementById("imageURL").value;
  displayImage = document.getElementById('toggleImage').checked;
  qrEl.innerHTML = qrcode(size,text);
}

var originalText = document.getElementById("text").value;
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
  var symbolSize = cellSize*moduleCount;

	output.push("<svg onmousemove='imageMove(evt)' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' width='"+symbolSize+"px' height='"+symbolSize+"px' viewBox='0 0 "+symbolSize+" "+symbolSize+"'>");
//  output.push(hazardousAreas(cellSize, moduleCount));

	for (var r = 0; r < moduleCount; r++) {
	    output.push("<g>");
	    for (var c = 0; c < moduleCount; c++) {
        output.push("<rect id='cell"+r+"-"+c+"' onclick='toggleCell(\"cell"+r+"-"+c+"\")' class='"+(qr.isDark(r,c)?"black":"white")+"' x='"+c*cellSize+"' y='"+r*cellSize+"' width='"+cellSize+"' height='"+cellSize+"'></rect>");
	    }
	    output.push("</g>");
	}

  output.push('<image id="image" '+(displayImage?'':'opacity="0"')+' onclick="moveImageToggle(evt)" x="'+imageOriginX+'" y="'+imageOriginY+'" width="100" height="100" xlink:href="'+imageURL+'"></image>');

	output.push("</svg>");
  return output.join(" ");
}

function moveImageToggle(e) {
  if (imageGrabbed) {
    imageGrabbed = false;
    imageOriginX = parseInt(imageEl.getAttribute("x"));
    imageOriginY = parseInt(imageEl.getAttribute("y"));
  } else {
    imageGrabbed = true;
    startingCursorX = e.screenX;
    startingCursorY = e.screenY;
    imageEl = document.getElementById("image");
    imageOriginX = parseInt(imageEl.getAttribute("x"));
    imageOriginY = parseInt(imageEl.getAttribute("y"));
  }
}

function imageMove(e) {
  if (imageGrabbed) {
    imageEl.setAttribute("x",imageOriginX+(e.screenX - startingCursorX)/imageSizeMagnification);
    imageEl.setAttribute("y",imageOriginY+(e.screenY - startingCursorY)/imageSizeMagnification);
  }
}

/*
 * Mark potentially dangerous areas to tamper with
 */
function hazardousAreas(cellSize, moduleCount) {
  var output = [];
  // Finder patterns
  output.push("<g id='hazards'>");
  output.push("<rect id='finder-top-left' x='0' y='0' width='"+8*cellSize+"' height='"+8*cellSize+"' class='hazard'></rect>");
  output.push("<rect id='finder-top-right' x='"+(cellSize*moduleCount-8*(cellSize))+"' y='0' width='"+8*cellSize+"' height='"+8*cellSize+"' class='hazard'></rect>");
  output.push("<rect id='finder-bottom-right' y='"+(cellSize*moduleCount-8*(cellSize))+"' x='0' width='"+8*cellSize+"' height='"+8*cellSize+"' class='hazard'></rect>");
  output.push("</g>");
  return output.join(" ");
};