'use strict';

  // data
  const d = data[dirName].volumes[vol];
  // mode
  const combined = d.combined;
  const reverse = d.reverse;
  const vertical = d.vertical;
  let single = combined ? true : false;
  // setting
  const toc = d.toc;
  const imgLen = d.count;
  let amount;
  let minCount;
  let maxCount;
  // single double の切り替え時に設定し直す必要がある。
  const setUp = () => {
    amount = combined || single ? 1 : 2;
    minCount = combined ? 1 : 2;
    maxCount = combined ? imgLen - 1 : imgLen - 2;
  }
  setUp();

  // width に応じてimgタグも切り替え
  const insertImageTag = (single) => {
    const singleTag = `<img id="imageSingle" src='' />`;
    const doubleTag = `<img id="imageLeft" src='' /><img id="imageRight" src='' />`;
    imageBox.innerHTML = single ? singleTag : doubleTag;
  }
  !vertical && insertImageTag(single); // 初回

  // カウンターの変更を受けて、画像表示を変える。便利っぽい。しかし、遅い
  function Counter() {
    let count = 0;
    Object.defineProperty(this, 'count', {
      get() {
        return count
      },
      set(value) {
        count = value;
        setImages(count);
      }
    });
    this.getCount = () => count;
  }
  const c = new Counter;
  // const c = {
  //   count: 0,
  // }

  const observer = new ResizeObserver((entries) => {
    const width = entries[0].contentRect.width;
    if (width < 1100 && !single) {
      single = true;
      console.log('mode single:', single);
      insertImageTag(single); // 初回
      setImages(c.count);
      setUp();
    } else if (width > 1100 && single && !combined) {
      single = false;
      console.log('mode single:', single);
      insertImageTag(single); // 初回
      setImages(c.count);
      setUp();
    } else {
      return;
    }
  });
  !vertical && observer.observe(imageBox);
  // console.log('mode single:', single);
  // const observer = new MutationObserver(() => {
  //   console.log('change count')
  //   setImages(count);
  // });
  // const config = {
  //   childList: true,
  // }
  // observer.observe(counter, config);
  if (vertical && chapterList) {
    chapterList.style.height = '90vh';
  }

  // console.log('cFunc.Counter', c.getCount());
  const listElem = toc && Array.from(chapterList.children);
  // 目次の見出しをクリックするとページ移動
  if (toc) {
    listElem.forEach(e => {
      e.addEventListener("click", (e) => {
        c.count = e.srcElement.dataset.p;
      });
    });
  }
  const toggleToc = () => {
    chapterList.classList.toggle('isHidden');
    TocHeader.classList.toggle('isClose');
  }
  toc && TocHeader.addEventListener('click', toggleToc, false);
  // 目次の現在の章の背景を色付け
  const checkCount = () => {
    const toc = data[dirName].volumes[vol].toc; // right [vol], wrong .vol 
    // listElemts.forEach(item => item.classList.remove("is_active"));
    listElem.forEach((e, x) => {
      const last = x === toc.length - 1;
      e.classList.remove("isActive");
      if (last && toc[toc.length - 1].p <= c.count) return listElem[x].classList.add("isActive");
      if (toc[x].p <= c.count && c.count < toc[x + 1].p) return listElem[x].classList.add("isActive")
    });
  };

  const increment = (n) => {
    if (c.count < maxCount) c.count = Number(c.count) + n;// setImages(c.count);
    
  }
  const decrement = (n) => {
    if (c.count >= minCount) c.count = Number(c.count) - n;// setImages(c.count);
  }
  const directSet = (n) => {
    c.count = n;// setImages(c.count);
  }

  // 渡された番号の画像を表示
  const setImages = (n) => {
    const x = Number(n);
    // if (window.innerWidth < 1000 && 
    if (single || combined) {
      // imageLeft.src = images[x];
      // imageRight.src = '';
      imageSingle.src = images[x];
    } else if (reverse) {
      imageLeft.src = images[x];
      imageRight.src = images[x + 1];
    } else if (vertical) {
      const imgTags = images.map((v, k) => (
        `<img src=${v} id=${k} />`
      ));
      imageVerticalBox.innerHTML = imgTags.join('');
    } else {
      imageLeft.src = images[x + 1];
      imageRight.src = images[x];
    }

    toc && checkCount();
    counter.innerText = Number(c.count) + 1;
  }
  setImages(0);

  const calcWidth = () => {
    if (!vertical) return;
    window.onload = () => {
      const tocWidth = chapterList.clientWidth;
      console.log(tocWidth);
      imageVerticalBox.style.marginLeft = `calc(${tocWidth}px + 30px)`;
    }
  }
  calcWidth();

  // page transition
  // +1ページ
  const plusOne = () => c.count < maxCount && increment(1);
  // -1ページ
  const minusOne = () => c.count >= minCount && decrement(1);
  // 次のページへ
  const goNext = () => reverse ? decrement(amount) : increment(amount);
  // 前のページへ
  const goPrevious = () => reverse ? increment(amount) : decrement(amount);
  // 最初のページ=へ
  const goStart = () => c.count > 0 && directSet(0);
  // 最後のページへ
  const goEnd = () => directSet(maxCount);
  // 10ページ進む
  const go10 = () => imgLen - c.count < 9 ? c.count = imgLen - Number(c.count) : increment(10);
  // 10ページ戻る
  const back10 = () => c.count < 9 ? c.count = c.count : decrement(10);
  // 章ごとのジャンプ移動
  const goChapterNum = (n) => n <= toc.length && directSet(d.toc[n - 1].p); // d.toc[n - 1].p は not defined になる
  // ◀クリックで次のページへ進む
  arrowLeft.addEventListener('click', () => goNext());
  // ▶クリックで前のページへ戻る
  arrowRight.addEventListener('click', () => goPrevious());
  // マウスホイールで前後ページ移動
  window.addEventListener("mousewheel", (e) => e.wheelDelta < 0 ? goNext() : goPrevious());
  // トップページへ戻る
  const goTopPage = (e) => {
    e.preventDefault();
    location.href = "./index.html";
  };

  // toggle combined mode single <-> double
  const toggleCombined = () => {
    !combined ? combined = true : combined = false;
  }
  const toggleReverse = () => {
    !reverse ? reverse = true : reverse = false;
  }

  // キー押下で前後ページ移動
  const a = { vertical, reverse, plusOne, minusOne, goNext, goPrevious, goStart, goEnd, go10, back10, goTopPage, goChapterNum, toggleToc };
  keyBindings(a);


