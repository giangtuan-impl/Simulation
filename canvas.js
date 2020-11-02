var colorDefinitions = {
  ff0000: "c1",
  "00ffff": "dw",
  "33ff00": "wt",
  "0000ff": "ra",
  "0099ff": "he",
  ff00ff: "in",
  "00ff99": "si",
  "9900ff": "kp",
};

var listDefaultFurniture = [
  //   "kp_i_wmw_x",
  "wt_sih_ove_x",
  "c1_efi",
  "iw_2_6",
  "he_gs_cwh",
  "si_s_zs",
  "c2_ewh_x",
];

var colorFurnitureOptions = {
  c1: [
    { choiceImg: "c1_ebr.jpg", furnitureImg: "c1_ebr.png", vnName: "Xám" },
    { choiceImg: "c1_efi.jpg", furnitureImg: "c1_efi.png", vnName: "nâu" },
  ],
  dw: [],
  wt: [
    {
      choiceImg: "wt_aih_sob.jpg",
      furnitureImg: "wt_aih_sob_x.png",
      vnName: "Trắng",
    },
    {
      choiceImg: "wt_sih_ove.jpg",
      furnitureImg: "wt_sih_ove_x.png",
      vnName: "Trắng",
    },
  ],
  ra: [],
  he: [],
  in: [],
  si: [],
  kp: [],
};

var tscs = {
  colorDefinitions,
  listDefaultFurniture,
  lastColorData: "",
  furnitureCode: "in",
};

var drawCanvas = document.getElementById("canvas");
var ctxDrawCanvas = drawCanvas.getContext("2d");
// ctxDrawCanvas.globalCompositeOperation = "destination-over";
var rollOverCanvas = document.getElementById("main_canvas_rollover");
var ctxRollOverCanvas = rollOverCanvas.getContext("2d");

var rollOverImage = document.getElementById("mainImage_canvas_rollover");

window.onload = function () {
  var img = document.getElementById("mainBg");
  var img2 = document.getElementById("crEl");
  ctxDrawCanvas.drawImage(img, 0, 0);
  ctxDrawCanvas.drawImage(img2, 0, 0);

  var i = 1;
  for (var key in colorDefinitions) {
    draw(ctxRollOverCanvas, `simData/${colorDefinitions[key]}.png`);
  }

  for (let index = 0; index < listDefaultFurniture.length; index++) {
    draw(ctxDrawCanvas, `images/kitchen_e/${listDefaultFurniture[index]}.png`);
  }
};

$("#changeCrColor").click(function () {
  var crEl = document.getElementById("crEl");
  crEl.src = "simData/c1_efi.png";
  draw("simData/c1_efi.png");
});

$(document).mousemove(function (event) {
  mouseX = event.pageX;
  mouseY = event.pageY;
  imageColorData = ctxRollOverCanvas.getImageData(mouseX, mouseY, 1, 1);
  var r = imageColorData.data[0];
  var g = imageColorData.data[1];
  var b = imageColorData.data[2];
  var a = imageColorData.data[3];

  var d = toHex(r) + toHex(g) + toHex(b);
  if (d != tscs.lastColorData) {
    tscs.furnitureCode = colorDefinitions[d] ?? "in";
    rollOverImage.src = `simData/${tscs.furnitureCode}_r.png`;
  }
});

$("#main_canvas_rollover").click(function () {
  console.log(tscs.furnitureCode);
  tscs.mouseClickFlg = true;
  generateColorOptions(tscs.furnitureCode);
});

function generateColorOptions(furnitureCode) {
  var options = colorFurnitureOptions[furnitureCode];

  $("#choseOption").empty();
  options.forEach((o) => {
    $("#choseOption").append(
      `<li class="choice-color-item" data-furniture-img="${o["furnitureImg"]}">
      <img src="images/choice/${o["choiceImg"]}" />
      </li>`
    );
  });
}

$(document).on("click", ".choice-color-item ", function () {
  var option = $(this).attr("data-furniture-img");
  console.log(option);
  draw(ctxDrawCanvas, `images/kitchen_e/${option}`);
});

function toHex(v) {
  return "" + ("00" + v.toString(16).toLowerCase()).substr(-2);
}

function draw(context, src) {
  var image = new Image();
  image.onload = function () {
    context.drawImage(image, 0, 0);
  };
  image.src = src;
}
