'use strict';

const keyBindings = (a) => {
  const { vertical, reverse, plusOne, minusOne, goNext, goPrevious, goStart, goEnd, go10, back10, goTopPage, goChapterNum, toggleToc } = a;
  if (vertical) return;
  document.body.addEventListener("keydown", (e) => {
    // ctrl + r など他のキーバインドは潰したくないので e.preventDefaultは個別に指定する
    if (e.ctrlKey) return;
    switch (e.code) {
      case "KeyJ": // j
      case "KeyD": // d
      case "ArrowDown": // down ↓
        goNext();
        return;
      case "KeyK": // k
      case "KeyE": // e
      case "ArrowUp": // up ↑
        goPrevious();
        return;
      case "KeyL": // l
      case "KeyF": // f
      case "ArrowRight": // right →
        reverse ? goNext() : goPrevious();
        return;
      case "KeyH": // h
      case "ArrowLeft": // left ←
      case "KeyS": // s
        reverse ? goPrevious() : goNext();
        return;
      case "KeyW": // w
      case "KeyN": // n
        go10();
        return;
      case "KeyB": // b
      case "KeyP": // p
        back10();
        return;
      case "Comma": // ,
      case "Home": // Home
      case "Digit0": // 0
        goStart();
        return;
      case "Period": // .
      case "End": // End
        goEnd();
        return;
      case "Digit1": // 1
        goChapterNum(1);
        return;
      case "Digit2": // 2
        goChapterNum(2);
        return;
      case "Digit3": // 3
        goChapterNum(3);
        return;
      case "Digit4": // 4
        goChapterNum(4);
        return;
      case "Digit5": // 5
        goChapterNum(5);
        return;
      case "Digit6": // 6
        goChapterNum(6);
        return;
      case "Digit7": // 7
        goChapterNum(7);
        return;
      case "Digit8": // 8
        goChapterNum(8);
        return;
      case "Digit9": // 9
        goChapterNum(9);
        return;
      case "Plus": // +
      case "Tab": // tab
      case "KeyY": // Y
      case "KeyU": // U
      case "KeyI": // I
      case "Equal": // =
        plusOne();
        return;
      case "Minus": // -
      case "KeyO": // O
      case "Semicolon": // ;
        minusOne();
        return;
      case "Escape": // ;
        goTopPage(e);
        return;
      case "KeyT": // T
        toggleToc();
        return;
      default:
        return;
    }
  });
}
