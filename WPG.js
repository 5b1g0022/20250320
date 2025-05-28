// 等待網頁內容載入完成後執行
document.addEventListener("DOMContentLoaded", () => {
    // 取得主要 DOM 元素
    const gameContainer = document.getElementById("game-container");
    const playButton = document.getElementById("play-button");
    const levelSelect = document.getElementById("level-select");

    // 顏色清單
    const colors = [
      "red", "blue", "green", "yellow", "orange", "purple", "pink", "brown",
      "cyan", "magenta", "lime", "teal", "indigo", "violet", "gold", "silver",
      "maroon", "navy", "olive", "coral",
    ];
    const tubes = [];           // 存放所有試管的陣列
    let selectedTube = null;    // 目前被選中的試管
    let levelCount = 1;         // 當前關卡

    // 設定關卡
    function chooseLevel(level) {
      levelCount = level;
      document.getElementById("level-count").textContent = levelCount;
    }

    // 關卡選單變更事件
    levelSelect.addEventListener("change", (event) => {
      const selectedLevel = parseInt(event.target.value, 10);
      chooseLevel(selectedLevel);
    });

    // 檢查遊戲狀態（是否完成）
    function checkGameState() {
      // 判斷一個試管是否全部為同色且有4格
      const allSameColor = (tube) => {
        const waters = Array.from(tube.children);
        return (
          waters.length === 4 &&
          waters.every(
            (water) =>
              water.style.backgroundColor === waters[0].style.backgroundColor
          )
        );
      };

      let completedTubes = 0;
      tubes.forEach((tube) => {
        if (allSameColor(tube)) {
          completedTubes++;
        }
      });
      document.getElementById("completed-tubes-count").textContent =
        completedTubes;

      // 檢查是否所有的試管都完成或者是空試管
      if (
        tubes.every((tube) => tube.childElementCount === 0 || allSameColor(tube))
      ) {
        if (levelCount === 10) {
          alert("恭喜!你已經完成所有挑戰!!");
        } else {
          alert("你已經完成本關卡!");
          levelCount++;
          document.getElementById("level-count").textContent = levelCount;
          document.getElementById("completed-tubes-count").textContent = 0;
          chooseLevel(levelCount);
          createTubes();
          fillTubes();
        }
      }
    }

    // 執行倒水動作
    function pourWater(fromTube, toTube) {
      let fromWater = fromTube.querySelector(".water:last-child");
      let toWater = toTube.querySelector(".water:last-child");

      if (!toWater) {
        // 目標試管為空，直接倒入同色水塊
        const color = fromWater ? fromWater.style.backgroundColor : null;
        while (
          fromWater &&
          fromWater.style.backgroundColor === color &&
          toTube.childElementCount < 4
        ) {
          toTube.appendChild(fromWater);
          fromWater = fromTube.querySelector(".water:last-child");
        }
      } else {
        // 目標試管有水，僅能倒入同色
        while (
          fromWater &&
          fromWater.style.backgroundColor === toWater.style.backgroundColor &&
          toTube.childElementCount < 4
        ) {
          toTube.appendChild(fromWater);
          fromWater = fromTube.querySelector(".water:last-child");
          toWater = toTube.querySelector(".water:last-child");
        }
      }
      checkGameState(); // 每次倒水後檢查遊戲狀態
    }

    // 處理試管點擊事件
    function selectTube(tube) {
      if (selectedTube) {
        if (selectedTube !== tube) {
          pourWater(selectedTube, tube); // 倒水
        }
        selectedTube.classList.remove("selected");
        selectedTube = null;
      } else {
        selectedTube = tube;
        tube.classList.add("selected");
      }
    }

    // 產生所有試管
    function createTubes() {
      gameContainer.innerHTML = ""; // 清空遊戲區
      tubes.length = 0;

      // 依照關卡數產生有顏色的試管
      for (let i = 0; i < levelCount + 1; i++) {
        const tube = document.createElement("div");
        tube.classList.add("tube");
        tube.addEventListener("click", () => selectTube(tube));
        gameContainer.appendChild(tube);
        tubes.push(tube);
      }

      // 新增兩管空的試管來當作緩衝使用
      for (let i = 0; i < 2; i++) {
        const emptyTube = document.createElement("div");
        emptyTube.classList.add("tube");
        emptyTube.addEventListener("click", () => selectTube(emptyTube));
        gameContainer.appendChild(emptyTube);
        tubes.push(emptyTube);
      }
    }

    // 填滿試管顏色
    function fillTubes() {
      // 取得本關所需顏色
      const gameColors = colors.slice(0, Math.min(levelCount + 1, colors.length));
      const waterBlocks = [];

      // 對於每一種顏色，產生4個水塊
      gameColors.forEach((color) => {
        for (let i = 0; i < 4; i++) {
          waterBlocks.push(color);
        }
      });

      // 將顏色打亂
      waterBlocks.sort(() => 0.5 - Math.random());

      // 將水塊分散到不同的試管
      let blockIndex = 0;
      tubes.slice(0, levelCount + 1).forEach((tube) => {
        for (let i = 0; i < 4; i++) {
          if (blockIndex < waterBlocks.length) {
            const water = document.createElement("div");
            water.classList.add("water");
            water.style.backgroundColor = waterBlocks[blockIndex];
            water.style.height = "20%";
            tube.appendChild(water);
            blockIndex++;
          }
        }
      });
    }

    // 點擊 PLAY 按鈕時，重設並開始新遊戲
    playButton.addEventListener("click", () => {
      tubes.length = 0;
      createTubes();
      fillTubes();
    });
});