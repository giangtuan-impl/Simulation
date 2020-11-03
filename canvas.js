var countFurniture = 0;

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
  { imgName: "in_1_6_x", order: 0, type: "in", id: "1" },
  { imgName: "kp_i_wmw_x", order: 0, type: "kp", id: "1" },
  { imgName: "c1_efi", order: 1, type: "c1", id: "1" },
  { imgName: "dw_esi", order: 2, type: "dw", id: "1" },
  { imgName: "ra_v2_si_x", order: 6, type: "ra", id: "1" },
  { imgName: "wt_sih_ove_x", order: 2, type: "wt" },
  { imgName: "iw_2_6", order: 4, type: "iw" },
  { imgName: "he_gs_cwh", order: 3, type: "he" },
  { imgName: "si_s_zs", order: 5, type: "si" },
  { imgName: "c2_ewh_x", order: 5, type: "c2" },
];

var furnitureColorOptions = {
  c1: {
    options: [
      {
        id: "1",
        choiceImg: "c1_ebr.jpg",
        furnitureImg: "c1_ebr",
        vnName: "Nâu",
      },
      {
        id: "2",
        choiceImg: "c1_efi.jpg",
        furnitureImg: "c1_efi",
        vnName: "Xám",
      },
    ],
    order: 2,
  },
  dw: {
    options: [
      {
        id: "1",
        choiceImg: "com_si.jpg",
        furnitureImg: "dw_esi",
        vnName: "Viền xám",
      },
      {
        id: "2",
        choiceImg: "com_bk.jpg",
        furnitureImg: "dw_lbk",
        vnName: "Viền đen",
      },
    ],
    order: 5,
  },
  wt: {
    options: [
      {
        id: "1",
        choiceImg: "wt_aih_sob.jpg",
        furnitureImg: "wt_aih_sob_x",
        vnName: "Trắng",
      },
      {
        id: "2",
        choiceImg: "wt_sih_ove.jpg",
        furnitureImg: "wt_sih_ove_x",
        vnName: "Thép",
      },
    ],
    order: 2,
  },
  ra: {
    options: [],
    order: 5,
  },
  he: {
    options: [],
    order: 4,
  },
  in: {
    options: [
      {
        id: "1",
        choiceImg: "in_2_1.jpg",
        furnitureImg: "in_2_1_x",
        vnName: "Hiện đại",
      },
      {
        id: "2",
        choiceImg: "in_1_6.jpg",
        furnitureImg: "in_1_6_x",
        vnName: "Thiên nhiên",
      },
    ],
    order: 0,
  },
  si: {
    options: [
      {
        id: "1",
        choiceImg: "si_h_dg.jpg",
        furnitureImg: "si_a_wh",
        vnName: "Trắng",
      },
      {
        id: "2",
        choiceImg: "si_s_zs.jpg",
        furnitureImg: "si_s_zs",
        vnName: "Chậu nhôm",
      },
    ],
    order: 5,
  },
  kp: {
    options: [
      {
        id: "1",
        choiceImg: "kp_i_ena.jpg",
        furnitureImg: "kp_i_egg_x",
        vnName: "Trắng",
      },
      {
        id: "2",
        choiceImg: "kp_i_pwh.jpg",
        furnitureImg: "kp_i_wmw_x",
        vnName: "Thép",
      },
    ],
    order: 0,
  },
};

var tscs = {
  colorDefinitions,
  listDefaultFurniture,
  furnitureCode: "in",
  inComingListImgName: [],
  currentImage: {
    imgObj: [],
    imgFileName: [],
  },
  imgWidth: 1600,
  imgHeight: 820,
  lastSelectedOption: {},
  btnActiveFlg: true,
  lastHexColorHover: "",
  lastHexColorClick: "",
};

var drawCanvas = document.getElementById("canvas");
var ctxDrawCanvas = drawCanvas.getContext("2d");
// ctxDrawCanvas.globalCompositeOperation = "destination-over";
var rollOverCanvas = document.getElementById("main_canvas_rollover");
var ctxRollOverCanvas = rollOverCanvas.getContext("2d");

var rollOverImage = document.getElementById("mainImage_canvas_rollover");

window.onload = function () {
  var img = document.getElementById("mainBg");
  // var img2 = document.getElementById("crEl");
  ctxDrawCanvas.drawImage(img, 0, 0);
  // ctxDrawCanvas.drawImage(img2, 0, 0);

  for (var key in colorDefinitions) {
    draw(ctxRollOverCanvas, `simData/${colorDefinitions[key]}.png`);
  }

  for (let index = 0; index < listDefaultFurniture.length; index++) {
    tscs.inComingListImgName.push(listDefaultFurniture[index]);
  }

  setupData();
};

$(document).mousemove(function (event) {
  var hexColor = getCanvasHexColor(ctxRollOverCanvas, event.pageX, event.pageY);

  if (hexColor != tscs.lastHexColorHover) {
    tscs.furnitureCode = colorDefinitions[hexColor] ?? "in";
    rollOverImage.src = `simData/${tscs.furnitureCode}_r.png`;
    tscs.lastHexColorHover = hexColor;
  }
});

function getCanvasHexColor(context, x, y) {
  var imageColorData = context.getImageData(x, y, 1, 1);
  var r = imageColorData.data[0];
  var g = imageColorData.data[1];
  var b = imageColorData.data[2];
  var a = imageColorData.data[3];

  return toHex(r) + toHex(g) + toHex(b);
}
$("#main_canvas_rollover").click(function (event) {
  var hexColor = getCanvasHexColor(ctxRollOverCanvas, event.pageX, event.pageY);
  if (tscs.lastHexColorClick != hexColor) {
    tscs.lastHexColorClick = hexColor;
    generateColorOptions(tscs.furnitureCode);
  }
});

$(document).on("click", ".choice-color-item ", function () {
  if (!tscs.btnActiveFlg) {
    return;
  }
  $(this)
    .parent("ul")
    .children("li")
    .children("img")
    .removeClass("selected-choice");
  $(this).children("img").addClass("selected-choice");

  var optionId = $(this).attr("data-option-id");
  var furnitureCode = $(this).attr("data-furniture-code");

  if (
    tscs.lastSelectedOption["type"] == furnitureCode &&
    tscs.lastSelectedOption["id"] == optionId
  ) {
    return;
  }

  tscs.lastSelectedOption = {
    type: furnitureCode,
    id: optionId,
  };

  var selectedOption = furnitureColorOptions[furnitureCode]["options"].find(
    (option) => {
      return option.id == optionId;
    }
  );

  var newOption = {
    imgName: selectedOption["furnitureImg"],
    type: furnitureCode,
  };
  bounceSelect();
  updateData(newOption);
});

function bounceSelect() {
  tscs.btnActiveFlg = false;
  setTimeout(() => (tscs.btnActiveFlg = true), 1000);
}

function updateData(newOption) {
  tscs.inComingListImgName.map((item) => {
    item["imgName"] =
      item["type"] === newOption["type"]
        ? newOption["imgName"]
        : item["imgName"];
  });

  setupData();
}

function setupData() {
  $("#iconLoader").fadeIn(300);
  // sort by order
  tscs.inComingListImgName.sort(function (a, b) {
    if (a.order > b.order) return 1;
    if (a.order < b.order) return -1;
    return 0;
  });

  loadImages();
}

function loadImages() {
  for (let i = 0; i < tscs.inComingListImgName.length; i++) {
    if (typeof tscs.currentImage["imgFileName"][i] === "undefined") {
      tscs.currentImage["imgFileName"][i] = "";
    }
    if (
      tscs.currentImage["imgFileName"][i] ==
      tscs.inComingListImgName[i]["imgName"]
    ) {
      countAndDraw();
    } else {
      tscs.imgChangeFLG = true;
      var image = new Image();
      image.src = `images/kitchen_e/${tscs.inComingListImgName[i]["imgName"]}.png`;
      tscs.currentImage["imgObj"][i] = image;
      image.onload = function () {
        countAndDraw();
      };
    }
  }
}

function countAndDraw() {
  // make sure all image loaded
  countFurniture++;
  if (countFurniture == tscs.inComingListImgName.length) {
    countFurniture = 0;
    drawImage();
  }
}

function drawImage() {
  if (tscs.imgChangeFLG) {
    ctxDrawCanvas.clearRect(0, 0, tscs.imgWidth, tscs.imgHeight);
    for (let i = 0; i < tscs.currentImage["imgFileName"].length; i++) {
      ctxDrawCanvas.drawImage(tscs.currentImage["imgObj"][i], 0, 0);
    }
  }
  tscs.imgChangeFLG = false;
  $("#iconLoader").fadeOut(300);
}

function generateColorOptions(furnitureCode) {
  var furniture = furnitureColorOptions[furnitureCode];

  $("#choseOption").empty();
  furniture.options.forEach((o) => {
    $("#choseOption").append(
      `<li class="choice-color-item" data-option-id="${o["id"]}" data-furniture-code="${furnitureCode}">
      <img src="images/choice/${o["choiceImg"]}" />
      <span class="choice-description">${o["vnName"]}</span>
      </li>`
    );
  });
}

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
