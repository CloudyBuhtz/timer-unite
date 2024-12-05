const MINUTE = 60000;
const SECOND = 1000;

let period = 6;
let sound;
let loopTimeout;

const timeLoop = () => {
  const nowTime = new Date(Date.now());
  const nowMinutes = nowTime.getMinutes();
  const nowSeconds = nowTime.getSeconds();

  let delayMinutes = period - (nowMinutes % period);
  let delaySeconds = 60 - nowSeconds;

  // Clear Sectors
  if (nowMinutes == 0 && nowSeconds == 0) {
    let sectorList = document.querySelectorAll(".sector");
    sectorList.forEach((el) => el.classList.remove("highlighted"));
    sectorList[0].classList.add("highlighted");
  }

  // console.log(`${nowMinutes % SECTOR} : ${nowSeconds}`)
  if (nowMinutes % period == 0 && nowSeconds == 0) {
    sound.play();

    // Highlight Sectors
    let sectorList = document.querySelectorAll(".sector");

    sectorList.forEach((el) => {
      if (nowMinutes >= el.dataset.minutes) {
        el.classList.add("highlighted");
      } else {
        el.classList.remove("highlighted");
      }
    });
  }

  let delayDiv = document.querySelector(".delay");

  let displayMinutes = delayMinutes < 10 ? `0${(delayMinutes - 1).toString()}` : delayMinutes.toString();
  let displaySeconds = delaySeconds < 10 ? `0${delaySeconds.toString()}` : delaySeconds.toString();
  delayDiv.innerText = `${displayMinutes} : ${displaySeconds}`;

  loopTimeout = window.setTimeout(timeLoop, 1000);
}

const setup = () => {
  window.clearTimeout(loopTimeout);

  //setup sectors
  const nowTime = new Date(Date.now());
  const nowMinutes = nowTime.getMinutes();
  const nowHour = nowTime.getHours();
  const displayHour = nowHour < 10 ? `0${nowHour.toString()}` : nowHour.toString();

  const sectorContainer = document.querySelector(".sectors");
  sectorContainer.replaceChildren();
  for (let min = 0; min < 60; min += period) {
    let displayMin = min < 10 ? `0${min.toString()}` : min.toString();

    let sector = document.createElement("div");
    sector.innerText = `${displayHour}:${displayMin}`;
    sector.classList.add("sector");
    sector.dataset.minutes = min;

    if (nowMinutes >= min) {
      sector.classList.add("highlighted");
    }
    sectorContainer.appendChild(sector);

    // console.log(`00:${displayMin}`)
  }

  sound = new Audio("sound.wav");

  timeLoop();
};

const setFavicon = (s) => {
  var link = document.querySelector("link[rel~='icon']");
  link.href = `./${s}.ico`;
};

window.addEventListener("load", () => {
  // load from storage
  const currentCoin = localStorage.getItem("coin") ?? "ghoul";
  const currentTime = parseInt(localStorage.getItem("time") ?? "6");
  const coins = document.querySelectorAll(".controls img");

  coins.forEach((e) => {
    if (e.dataset.coin === currentCoin) {
      e.classList.add("highlighted");
    } else {
      e.classList.remove("highlighted");
    }
  });
  document.body.className = currentCoin;
  setFavicon(currentCoin);

  const time = document.querySelector("#time");
  period = currentTime;
  time.checked = currentTime === 4;

  setup();

  coins.forEach(e => e.addEventListener("click", () => {
    const hc = document.querySelector(".controls > img.highlighted");
    if (e.dataset.coin === hc.dataset.coin) return;

    coins.forEach(c => c.classList.remove("highlighted"));
    e.classList.add("highlighted");

    setFavicon(e.dataset.coin);
    localStorage.setItem("coin", e.dataset.coin);
    document.body.className = e.dataset.coin;
  }));

  time.addEventListener("change", () => {
    period = period === 6 ? 4 : 6;
    localStorage.setItem("time", period.toString());
    setup();
  });
});
