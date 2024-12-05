const MINUTE = 60000;
const SECOND = 1000;

let period = 6;
let sound;
let loopTimeout;

const timeLoop = () => {
  const nowTime = new Date(Date.now());
  const nowMinutes = nowTime.getMinutes();
  const nowSeconds = nowTime.getSeconds();

  const delayMinutes = period - (nowMinutes % period);
  const delaySeconds = 60 - nowSeconds;

  // Clear Sectors
  if (nowMinutes == 0 && nowSeconds == 0) {
    const sectorList = document.querySelectorAll(".sector");
    sectorList.forEach((el) => el.classList.remove("highlighted"));
    sectorList[0].classList.add("highlighted");
  }

  // console.log(`${nowMinutes % SECTOR} : ${nowSeconds}`)
  if (nowMinutes % period == 0 && nowSeconds == 0) {
    sound.play();

    // Highlight Sectors
    const sectorList = document.querySelectorAll(".sector");

    sectorList.forEach((el) => {
      if (nowMinutes >= el.dataset.minutes) {
        el.classList.add("highlighted");
      } else {
        el.classList.remove("highlighted");
      }
    });
  }

  const delayDiv = document.querySelector(".delay");

  const displayMinutes = delayMinutes < 10 ? `0${(delayMinutes - 1).toString()}` : delayMinutes.toString();
  const displaySeconds = delaySeconds < 10 ? `0${delaySeconds.toString()}` : delaySeconds.toString();
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
  const link = document.querySelector("link[rel~='icon']");
  link.href = `./${s}.ico`;
};

const setCoin = (coin) => {
  const coins = document.querySelectorAll(".controls img");

  coins.forEach((e) => {
    if (e.dataset.coin === coin.dataset.coin) {
      e.classList.add("highlighted");
    } else {
      e.classList.remove("highlighted");
    }
  });
  document.body.className = coin.dataset.coin;
  setFavicon(coin.dataset.coin);
  sessionStorage.setItem("coin", coin.dataset.coin);

  if (coin.dataset.time) {
    setPeriod(parseInt(coin.dataset.time));
  }
};

const setPeriod = (p) => {
  period = p;
  sessionStorage.setItem("time", p.toString());
  document.querySelector("#time").checked = p === 4;
  setup();
};

window.addEventListener("load", () => {
  // Guess the coin / time
  let defaultCoin = "ghoul";
  let defaultTime = 6;
  const month = (new Date()).getMonth();

  if (month === 11 || month === 0) {
    defaultCoin = "holiday";
    defaultTime = 6;
  }
  if (month === 3 || month === 4) {
    defaultCoin = "anniversary";
    defaultTime = 4;
  }

  // load from storage
  const currentCoin = sessionStorage.getItem("coin") ?? localStorage.getItem("coin") ?? defaultCoin;
  const currentTime = parseInt(sessionStorage.getItem("time") ?? localStorage.getItem("time") ?? defaultTime);
  const coins = [...document.querySelectorAll(".controls img")];

  setCoin(coins.filter(c => c.dataset.coin === currentCoin)[0]);
  setPeriod(currentTime);

  setup();

  coins.forEach(e => e.addEventListener("click", () => {
    const hc = document.querySelector(".controls > img.highlighted");
    if (e.dataset.coin === hc.dataset.coin) return;

    setCoin(e);
  }));

  time.addEventListener("change", () => {
    setPeriod(period === 6 ? 4 : 6);
  });
});
