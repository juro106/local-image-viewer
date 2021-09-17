'use strict';

const loadAllCallback = (elems, callback, loading) => {
  if (loading) {
    Loading.innerHTML = `<div class='loader'></div>...Loading<div id='loadCounter'></div>`;
  }
  let count = 0;
  elems.forEach(e => {
    e.onload = () => {
      count += 1;
      if (loading) loadCounter.innerText = count;
      if (count === elems.length) callback();
    }
  });
}

const init = () => {
  // data
  const { combined, reverse, vertical, toc, count: imgLen, ext } = data[dirName].volumes[vol];
  // setting
  const tocHeight = '90vh';
  const singleLimitWidth = 1100;
  let single = combined ? true : false;
  let amount, minCount, maxCount;

  // 画像の配列を取得 & preload
  const images = [...Array(imgLen)].map((_, i) => {
    const num = ('000' + i).slice(-3);
    return `${basePath}/${dirName}/images/${vol}/${num}${ext}`;
  });
  const imgArray = images.map(url => {
    const img = document.createElement("img");
    img.src = url;
    return img;
  });
  const removeLoading = () => {
    Loading.parentNode.removeChild(Loading);
  }
  loadAllCallback(imgArray, removeLoading, true);

  // class Counter {
  //   constructor() {
  //     let count = 0;
  //     Object.defineProperty(this, 'count', {
  //       get() {
  //         return count
  //       },
  //       set(value) {
  //         count = value;
  //         !vertical && setImages(count);
  //         toc && colorToc();
  //         counter.innerText = Number(count) + 1;
  //       }
  //     });
  //     this.getCount = () => count;
  //   }
  // }
  // const c = new Counter;

  // カウンターの変更を受けて、各種表示
  const c = (() => {
    let count = 0;
    return {
      get count() {
        return count
      },
      set count(val) {
        count = val;
        !vertical && setImages(count);
        toc && colorToc();
        counter.innerText = Number(count) + 1;
      }
    };
  })();

  // width に応じてimgタグを切り替え
  const insertImageTag = (single) => {
    const singleTag = `<img id="imageSingle" src='' />`;
    const doubleTag = `<img id="imageLeft" src='' /><img id="imageRight" src='' />`;
    imageBox.innerHTML = single ? singleTag : doubleTag;
  }

  // 画面の幅を監視、値に応じて single <-> double 切り替え
  const observer = new ResizeObserver((entries) => {
    if (combined || vertical) return;
    const width = entries[0].contentRect.width;
    if (width < singleLimitWidth && !single) {
      single = true;
      reset();
    } else if (width > singleLimitWidth && single) {
      single = false;
      reset();
    } else {
      return;
    }
  });

  // console.log('cFunc.Counter', c.getCount());
  const listElem = toc && chapterList.querySelectorAll('.chapter-item');
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
  const colorToc = () => {
    const toc = data[dirName].volumes[vol].toc; // right [vol], wrong .vol 
    // listElemts.forEach(item => item.classList.remove("is_active"));
    listElem.forEach((e, x) => {
      const last = x === toc.length - 1;
      e.classList.remove("isActive");
      if (last && toc[toc.length - 1].p <= c.count) return listElem[x].classList.add("isActive");
      if (toc[x].p <= c.count && c.count < toc[x + 1].p) return listElem[x].classList.add("isActive")
    });
  };

  // 渡された番号の画像を表示
  const setImages = (n) => {
    const x = Number(n);
    if (single || combined) {
      imageSingle.src = images[x];
    } else if (reverse) {
      imageLeft.src = images[x];
      imageRight.src = images[x + 1] ? images[x + 1] : '';
    } else {
      imageLeft.src = images[x + 1] ? images[x + 1] : '';
      imageRight.src = images[x];
    }
  }
  // setImages(0);

  // single <-> double の切り替え時の再設定用
  const reset = () => {
    amount = single ? 1 : 2;
    minCount = single ? 1 : 2;
    maxCount = single ? imgLen - 1 : imgLen - 2;
    insertImageTag(single);
    // single -> double へ切替時、元いたページが奇数(見開きの左側)だったら count - 1
    const n = !single && c.count % 2 !== 0 ? c.count - 1 : c.count;
    directSet(n);
  }

  // vertical mode 専用
  const calcWidth = () => {
    if (!vertical) return;

    return new Promise(resolve => {
      window.onload = () => {
        const tocWidth = chapterList.clientWidth;
        console.log(tocWidth);
        imageVerticalBox.style.marginLeft = `calc(${tocWidth}px + 30px)`;
        chapterList && (chapterList.style.height = tocHeight);
        return resolve();
      }
    });
  }
  const imagesSetVertical = () => {
    const imgTags = images.map((v, k) => (
      `<img src=${v} id=${k} />`
    ));
    imageVerticalBox.innerHTML = imgTags.join('');
  }
  const asyncSetImage = () => {
    return new Promise((resolve) => {
      calcWidth().then(() => {
        return resolve();
      }).then(() => {
        imagesSetVertical();
      });
    });
  }
  // vertical mode 専用 ここまで

  // page transition
  const increment = n => c.count < maxCount && (c.count = Number(c.count) + n);
  const decrement = n => c.count >= minCount && (c.count = Number(c.count) - n);
  const directSet = n => c.count = n;
  // +1ページ
  const add1 = () => increment(1);
  // -1ページ
  const sub1 = () => decrement(1);
  // 次のページへ
  const goNext = () => reverse ? decrement(amount) : increment(amount);
  // 前のページへ
  const goPrevious = () => reverse ? increment(amount) : decrement(amount);
  // 最初のページ=へ
  const goStart = () => directSet(0);
  // 最後のページへ
  const goEnd = () => directSet(maxCount);
  // +10ページ
  const add10 = () => maxCount - c.count < 9 ? increment(maxCount - Number(c.count)) : increment(10);
  // -10ページ
  const sub10 = () => c.count < 9 ? directSet(0) : decrement(10);
  // 章ごとのジャンプ移動
  const goChapterHead = n => toc && n <= toc.length && directSet(toc[n - 1].p); // v.toc[n - 1].p は not defined になる
  // ◀クリックで次のページへ進む
  arrowLeft.addEventListener('click', goNext, false);
  // ▶クリックで前のページへ戻る
  arrowRight.addEventListener('click', goPrevious, false);
  // マウスホイールで前後ページ移動
  window.addEventListener("mousewheel", (e) => {
    if (vertical) return;
    e.wheelDelta < 0 ? goNext() : goPrevious();
  });
  // index ページへ戻る
  const goTopPage = (e) => {
    e.preventDefault(); // ctrl + r など他のキーバインドは潰したくないので個別に指定
    location.href = "./index.html";
  };

  // キー押下で前後ページ移動
  const a = { add1, sub1, add10, sub10, goNext, goPrevious, goStart, goEnd, goTopPage, goChapterHead, toggleToc };
  !vertical && keyBindings(a);
  // });
  // 初期化
  const setUp = () => {
    amount = combined || single ? 1 : 2;
    minCount = combined ? 1 : 2;
    maxCount = combined ? imgLen - 1 : imgLen - 2;
    if (vertical) {
      asyncSetImage();
    } else {
      observer.observe(imageBox);
      insertImageTag(single);
      directSet(0);
    }
  }
  setUp();
}

