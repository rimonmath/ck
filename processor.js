let red = 0;
let green = 0;
let blue = 0;
let dept = 100;

let video1Config = {
  left: 0
};
let video2Config = {
  left: 0,
  top: 0,
  zoom: 0.1
};

function moveVideo2(direction) {
  if (direction === "right") {
    video2Config.left += 50;
  }

  if (direction === "left") {
    video2Config.left -= 50;
  }

  if (direction === "up") {
    video2Config.top -= 50;
  }

  if (direction === "down") {
    video2Config.top += 50;
  }
}

// function moveVideo2(direction) {
//   if (direction === "right") {
//     video2Config.left += 100;
//     console.log(video2Config.left);
//   }
// }

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

function handleKeyup(el) {
  let result = hexToRgb(el.value);
  if (result) {
    red = result.r;
    green = result.g;
    blue = result.b;
  }
}

handleKeyup({ value: "#60e409" });

function handleKeyupDept(el) {
  dept = parseInt(el.value);
  console.log(dept);
}

let processor1 = {
  timerCallback: function () {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    let self = this;
    setTimeout(function () {
      self.timerCallback();
    }, 0);
  },

  doLoad: function () {
    this.video = document.getElementById("video1");

    this.c1 = document.getElementById("c1");
    this.ctx1 = this.c1.getContext("2d");

    this.c = document.getElementById("canvas1");
    this.ctx = this.c.getContext("2d");

    let self = this;
    this.video.addEventListener(
      "play",
      function () {
        self.width = 800; //self.video.videoWidth;
        console.log(self.video.videoWidth);
        self.height = 450; //self.video.videoHeight;
        self.timerCallback();
      },
      false
    );
  },

  computeFrame: function () {
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);

    let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
    let l = frame.data.length / 4;

    for (let i = 0; i < l; i++) {
      let r = frame.data[i * 4 + 0];
      let g = frame.data[i * 4 + 1];
      let b = frame.data[i * 4 + 2];
      if (
        Math.abs(r - red) < dept &&
        Math.abs(g - green) < dept &&
        Math.abs(b - blue) < dept
      )
        frame.data[i * 4 + 3] = 0;
    }
    this.ctx.putImageData(frame, 0, 0);
    return;
  }
};

let processor2 = {
  timerCallback: function () {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    let self = this;
    setTimeout(function () {
      self.timerCallback();
    }, 0);
  },

  scaleUp: function () {
    this.ctx1.scale(1.1, 1.1);
    this.ctx.clearRect(0, 0, 1280, 720);
    this.ctx1.clearRect(0, 0, 1280, 720);
  },
  scaleDown: function () {
    this.ctx1.scale(0.9, 0.9);
    this.ctx.clearRect(0, 0, 1280, 720);
    this.ctx1.clearRect(0, 0, 1280, 720);
  },

  doLoad: function () {
    this.video = document.getElementById("video2");

    this.c1 = document.getElementById("c2");
    this.ctx1 = this.c1.getContext("2d");

    this.c = document.getElementById("canvas2");
    this.ctx = this.c.getContext("2d");

    let self = this;
    this.video.addEventListener(
      "play",
      function () {
        self.width = 800; //self.video.videoWidth / 3;
        self.height = 450; //self.video.videoHeight / 3;
        self.timerCallback();
      },
      false
    );
  },

  computeFrame: function () {
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
    let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
    let l = frame.data.length / 4; // may be 4 -> alpha

    for (let i = 0; i < l; i++) {
      let r = frame.data[i * 4 + 0];
      let g = frame.data[i * 4 + 1];
      let b = frame.data[i * 4 + 2];

      if (
        Math.abs(r - red) < dept &&
        Math.abs(g - green) < dept &&
        Math.abs(b - blue) < dept
      ) {
        frame.data[i * 4 + 3] = 0;
      }
    }

    this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    // this.ctx.scale(video2Config.zoom, video2Config.zoom);
    this.ctx.putImageData(frame, video2Config.left, video2Config.top);
    return;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  processor1.doLoad();
  processor2.doLoad();
});

function scaleUp2() {
  processor2.scaleUp();
}

function scaleDown2() {
  processor2.scaleDown();
}
