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
    return this.currentImgs["selectedOptions"][type] == img;
  }

  getCanvasHexColor(x, y) {
    var imageColorData = this.context.getImageData(x, y, 1, 1);
    var r = imageColorData.data[0];
    var g = imageColorData.data[1];
    var b = imageColorData.data[2];
    var a = imageColorData.data[3];

    return (
      "#" +
      this.convertRgbNumberToHex(r) +
      this.convertRgbNumberToHex(g) +
      this.convertRgbNumberToHex(b)
    );
  }

  convertRgbNumberToHex(v) {
    return "" + ("00" + v.toString(16).toLowerCase()).substr(-2);
  }
}

var ctxDrawCanvas = document.getElementById("canvas").getContext("2d");

var ctxRollOverCanvas = document
  .getElementById("main_canvas_rollover")
  .getContext("2d");

var drawCanvas;
var rollOverCanvas;
var rollOverImage = document.getElementById("mainImage_canvas_rollover");
var data;
var tscs = {
  furnitureCode: "in",
  lastSelectedOption: {},
  btnActiveFlg: true,
  lastHexColorHover: "",
  lastHexColorClick: "",
  lastFurnitureTypeHover: "",
};

window.onload = function () {
  $.getJSON("js/db.json", function (res) {
    data = res;
    drawCanvas = new Simulation(ctxDrawCanvas, res.width, res.height);
    rollOverCanvas = new Simulation(ctxRollOverCanvas, res.width, res.height);

    res.backgrounds.forEach((b) =>
      rollOverCanvas.insertOption(b.name, b.backgroundImg, b.order)
    );
    rollOverCanvas.draw();

    res.items.forEach((item) => {
      drawCanvas.insertOption(
        item["name"],
        item["defaultOption"]["furnitureImg"],
        item["order"]
      );
    });
    drawCanvas.draw();
  });
};

$("#main_canvas_rollover").mousemove(function (event) {
  var hexColor = rollOverCanvas.getCanvasHexColor(event.pageX, event.pageY);

  if (hexColor != tscs.lastHexColorHover) {
    tscs.lastHexColorHover = hexColor;
    var hoverBg = data.backgrounds.find((item) => item.color === hexColor);
    rollOverImage.src = hoverBg ? hoverBg.hoverImg : data.defaultHoverImg;
    tscs.lastFurnitureTypeHover = hoverBg ? hoverBg.name : "";
  }
});

$("#main_canvas_rollover").click(function (event) {
  if (
    tscs.lastHexColorClick != tscs.lastHexColorHover &&
    tscs.lastFurnitureTypeHover != ""
  ) {
    tscs.lastHexColorClick = tscs.lastHexColorHover;

    var item = data.items.find(
      (item) => item.name == tscs.lastFurnitureTypeHover
    );
    var options = item ? item.options : [];

    generateColorOptions(options);
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

  var selectedItem = data.items.find((item) => item.name == furnitureCode);
  if (!selectedItem || !selectedItem.options) {
    return;
  }
  var selectedOption = selectedItem.options.find((op) => op.id == optionId);
  bounceSelect();
  drawCanvas.updateSelectOption(furnitureCode, selectedOption["furnitureImg"]);
  $("#iconLoader").fadeOut(600);
});

function bounceSelect() {
  tscs.btnActiveFlg = false;
  setTimeout(() => (tscs.btnActiveFlg = true), 1000);
}

function generateColorOptions(options) {
  var furnitureCode = tscs.lastFurnitureTypeHover;
  $("#choseOption").empty();
  options.forEach((o) => {
    var className = drawCanvas.isSelectedOption(
      furnitureCode,
      o["furnitureImg"]
    )
      ? "selected-choice"
      : "";

    $("#choseOption").append(
      `<li class="choice-color-item" data-option-id="${o["id"]}" data-furniture-code="${furnitureCode}">
      <img src="${o["choiceImg"]}" class=${className} />
      <span class="choice-description">${o["vnName"]}</span>
      </li>`
    );
  });
}
