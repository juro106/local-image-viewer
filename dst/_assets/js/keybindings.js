'use strict';

const keyBindings = (a) => {
  const { add1, sub1, add10, sub10, goNext, goPrevious, goStart, goEnd, goTopPage, goChapterHead, toggleToc } = a;
  const index = {
    "KeyJ":() => goNext(),
    "KeyD":() => goNext(),
    "KeyH":() => goNext(),
    "KeyS":() => goNext(),
    "KeyK":() => goPrevious(),
    "KeyE":() => goPrevious(),
    "KeyL":() => goPrevious(),
    "KeyF":() => goPrevious(),
    "ArrowLeft":() => goNext(),
    "ArrowDown":() => goNext(),
    "ArrowUp":() => goPrevious(),
    "ArrowRight":() => goPrevious(),
    "KeyW":() => add10(),
    "KeyN":() => add10(),
    "KeyB":() => sub10(),
    "KeyP":() => sub10(),
    "Comma":() => goStart(),
    "Home":() => goStart(),
    "Digit0":() => goStart(),
    "Period":() => goEnd(),
    "End":() => goEnd(),
    "Digit1":() => goChapterHead(1),
    "Digit2":() => goChapterHead(2),
    "Digit3":() => goChapterHead(3),
    "Digit4":() => goChapterHead(4),
    "Digit5":() => goChapterHead(5),
    "Digit6":() => goChapterHead(6),
    "Digit7":() => goChapterHead(7),
    "Digit8":() => goChapterHead(8),
    "Digit9":() => goChapterHead(9),
    "Plus":() => add1(),
    "Tab":() => add1(),
    "KeyY":() => add1(),
    "KeyU":() => add1(),
    "KeyI":() => add1(),
    "Equal":() => add1(),
    "Minus":() => sub1(),
    "KeyO":() => sub1(),
    "Semicolon":() => sub1(),
    "KeyT":() => toggleToc(),
  };
  document.body.addEventListener("keydown", (e) => {
    // !index[e.code];

    e.code==="Escape" ? goTopPage(e) : index[e.code] && index[e.code]();
    // index[e.code] && index[e.code]();
// : index[e.code]();
    // ctrl + r など他のキーバインドは潰したくないので e.preventDefaultは個別に指定する
    // if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
    // e.code==="Escape" ? goTopPage(e) : index[e.code] && index[e.code]();
  });
}
