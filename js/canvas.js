class Simulation {
  constructor(context, width, height) {
    this.context = context;
    this.width = width;
    this.height = height;
    this.countImg = 0;
    this.listNewImg = [];
    this.currentImgs = {
      img: [],
      imgObj: [],
      selectedOptions: {},
    };
    this.imgChangeFLG = false;
  }

  insertOption(type, img, order) {
    this.listNewImg.push({
      img,
      type,
      order,
    });
  }

  updateSelectOption(type, img) {
    this.listNewImg.map((item) => {
      item["img"] = item["type"] === type ? img : item["img"];
    });

    this.draw();
  }

  sortImgByOrder() {
    // sort by order
    this.listNewImg.sort(function (a, b) {
      if (a.order > b.order) return 1;
      if (a.order < b.order) return -1;
      return 0;
    });
  }

  countAndDraw() {
    // make sure all image loaded
    this.countImg++;
    if (this.countImg == this.listNewImg.length) {
      this.countImg = 0;
      this.drawImage();
    }
  }

  loadImages() {
    for (let i = 0; i < this.listNewImg.length; i++) {
      if (typeof this.currentImgs["img"][i] === "undefined") {
        this.currentImgs["img"][i] = "";
      }
      if (this.currentImgs["img"][i] == this.listNewImg[i]["img"]) {
        this.countAndDraw();
      } else {
        this.imgChangeFLG = true;
        var image = new Image();
        image.src = this.listNewImg[i]["img"];
        this.currentImgs["imgObj"][i] = image;
        this.currentImgs["img"][i] = this.listNewImg[i]["img"];
        this.currentImgs["selectedOptions"][
          this.listNewImg[i]["type"]
        ] = this.listNewImg[i]["img"];
        var a = this;
        image.onload = function () {
          a.countAndDraw();
        };
      }
    }
  }

  drawImage() {
    if (this.imgChangeFLG) {
      console.log(this.currentImgs);
      this.context.clearRect(0, 0, this.width, this.height);
      for (let i = 0; i < this.currentImgs["img"].length; i++) {
        this.context.drawImage(this.currentImgs["imgObj"][i], 0, 0);
      }
    }
    this.imgChangeFLG = false;
  }

  draw() {
    this.sortImgByOrder();
    this.loadImages();
  }

  isSelectedOption(type, img) {
    console.log(this.currentImgs["selectedOptions"]);
    return this.currentImgs["selectedOptions"][type] == img;
  }

  getCanvasHexColor(x, y) {
    var imageColorData = this.context.getImageData(x, y, 1, 1);
    var r = imageColorData.data[0];
    var g = imageColorData.data[1];
    var b = imageColorData.data[2];
    var a = imageColorData.data[3];

    return (
      this.convertRgbNumberToHex(r) +
      this.convertRgbNumberToHex(g) +
      this.convertRgbNumberToHex(b)
    );
  }

  convertRgbNumberToHex(v) {
    return "" + ("00" + v.toString(16).toLowerCase()).substr(-2);
  }
}

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

function getSimImage(name) {
  return `simData/${name}.png`;
}

function getKitchenImage(name) {
  return `images/kitchen_e/${name}.png`;
}

function getChoiceImage(name) {
  return `images/choice/${name}.jpg`;
}

// var drawCanvas = document.getElementById("canvas");
var ctxDrawCanvas = document.getElementById("canvas").getContext("2d");

var ctxRollOverCanvas = document
  .getElementById("main_canvas_rollover")
  .getContext("2d");

var drawCanvas = new Simulation(ctxDrawCanvas, 1600, 820);
var rollOverCanvas = new Simulation(ctxRollOverCanvas, 1600, 820);
var rollOverImage = document.getElementById("mainImage_canvas_rollover");

window.onload = function () {
  for (var key in colorDefinitions) {
    rollOverCanvas.insertOption(
      colorDefinitions[key],
      getSimImage(colorDefinitions[key]),
      1
    );
  }
  rollOverCanvas.draw();

  for (let index = 0; index < listDefaultFurniture.length; index++) {
    var fur = listDefaultFurniture[index];
    drawCanvas.insertOption(
      fur["type"],
      getKitchenImage(fur["imgName"]),
      fur["order"]
    );
  }
  drawCanvas.draw();
};

var tscs = {
  furnitureCode: "in",
  lastSelectedOption: {},
  btnActiveFlg: true,
  lastHexColorHover: "",
  lastHexColorClick: "",
};

$("#main_canvas_rollover").mousemove(function (event) {
  var hexColor = rollOverCanvas.getCanvasHexColor(event.pageX, event.pageY);

  if (hexColor != tscs.lastHexColorHover) {
    tscs.furnitureCode = colorDefinitions[hexColor] ?? "in";
    rollOverImage.src = `simData/${tscs.furnitureCode}_r.png`;
    tscs.lastHexColorHover = hexColor;
  }
});

$("#main_canvas_rollover").click(function (event) {
  var hexColor = rollOverCanvas.getCanvasHexColor(event.pageX, event.pageY);
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
  $("#iconLoader").fadeIn(300);
  tscs.lastSelectedOption = {
    type: furnitureCode,
    id: optionId,
  };

  var selectedOption = furnitureColorOptions[furnitureCode]["options"].find(
    (option) => {
      return option.id == optionId;
    }
  );

  bounceSelect();
  drawCanvas.updateSelectOption(
    furnitureCode,
    getKitchenImage(selectedOption["furnitureImg"])
  );
  $("#iconLoader").fadeOut(600);
});

function bounceSelect() {
  tscs.btnActiveFlg = false;
  setTimeout(() => (tscs.btnActiveFlg = true), 1000);
}

function generateColorOptions(furnitureCode) {
  var furniture = furnitureColorOptions[furnitureCode];

  $("#choseOption").empty();
  furniture.options.forEach((o) => {
    var className = drawCanvas.isSelectedOption(
      furnitureCode,
      getKitchenImage(o["furnitureImg"])
    )
      ? "selected-choice"
      : "";

    $("#choseOption").append(
      `<li class="choice-color-item" data-option-id="${o["id"]}" data-furniture-code="${furnitureCode}">
      <img src="images/choice/${o["choiceImg"]}" class=${className} />
      <span class="choice-description">${o["vnName"]}</span>
      </li>`
    );
  });
}
