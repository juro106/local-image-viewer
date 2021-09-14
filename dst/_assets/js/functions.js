'use strict';

const loadAllCallback = (elems, callback, loading, target) => {
  if (loading) {
    target.innerHTML = `<div class='loader'></div>...Loading<div id='loadCounter'></div>`;
  }
  let count = 0;
  elems.forEach(e => {
    e.onload = () => {
      count += 1;
      if (loading) loadCounter.innerText = count;
      if (count === elems.length) {
        callback(target);
      }
    }
  });
}

const removeLoading = (Loading) => {
  Loading.parentNode.removeChild(Loading);
}


const initRedux = (combined, imgLen, reverse) => {
  const single = combined ? true : false;
  console.log('single', single);
  const amount = combined || single ? 1 : 2;
  const imgLength = imgLen;
  const minCount = combined ? 1 : 2;
  const maxCount = combined ? imgLen - 1 : imgLen - 2;
  store.dispatch(initState(amount, minCount, imgLength, maxCount, single, combined, reverse));
}

const init = () => {
  // data
  const { combined, reverse, vertical, toc, count: imgLen, ext } = data[dirName].volumes[vol];
  // setting
  // const single = combined ? true : false;
  // console.log('single',single);
  // store.getState().single;
  const tocHeight = '90vh';
  const singleLimitWidth = 1100;
  initRedux(combined, imgLen, reverse);
  const single = store.getState().single;

  // 画面の幅を監視、値に応じて single <-> double 切り替え
  const observer = new ResizeObserver((entries) => {
    // if (combined || vertical) return;
    const width = entries[0].contentRect.width;
    if (width < singleLimitWidth && !single) {
      toggleSingle();
      reset();
    } else if (width > singleLimitWidth && single) {
      toggleSingle();
      reset();
    } else {
      return;
    }
  });

  // width に応じてimgタグも切り替え
  const insertImageTag = (single, target) => {
    const singleTag = `<img id="imageSingle" src='' />`;
    const doubleTag = `<img id="imageLeft" src='' /><img id="imageRight" src='' />`;
    target.innerHTML = single ? singleTag : doubleTag;
  }

  // 渡された番号の画像を表示
  // const setImagesCurry = (single, combined, images) => {
  // const reverse = store.getState().reverse;
  // return (n) => {

  // vertical mode 専用
  const initVertical = (vertical, chapterList, imageVerticalBox, images, tocHeight) => {
    const calcWidth = () => {
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
    asyncSetImage();
  }
  // vertical mode 専用 ここまで
  // single <-> double の切り替え時の再設定用
  const reset = () => {
    const single = store.getState().single;
    const imgLen = store.getState().imgLength;
    const currentCount = store.getState().count;
    const amount = single ? 1 : 2;
    const minCount = single ? 1 : 2;
    const maxCount = single ? imgLen - 1 : imgLen - 2;
    store.dispatch(resetState(amount, minCount, maxCount));
    insertImageTag(single, imageBox);
    // single -> double へ切替時、元いたページが奇数(見開きの左側)だったら count - 1
    const count = !single && currentCount % 2 !== 0 ? currentCounte - 1 : currentCount;
    setImages(count);
  }


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
  loadAllCallback(imgArray, removeLoading, true, Loading);


  // const setImages = setImagesCurry(single, combined, images);

  // console.log('cFunc.Counter', c.getCount());
  const listElem = toc && chapterList.querySelectorAll('.chapter-item');
  // Array.from(chapterList.children);
  // 目次の見出しをクリックするとページ移動
  if (toc) {
    listElem.forEach(e => {
      e.addEventListener("click", (e) => {
        count = e.srcElement.dataset.p;
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
    const count = store.getState().count;
    const toc = data[dirName].volumes[vol].toc; // right [vol], wrong .vol 
    // listElemts.forEach(item => item.classList.remove("is_active"));
    listElem.forEach((e, x) => {
      const last = x === toc.length - 1;
      e.classList.remove("isActive");
      if (last && toc[toc.length - 1].p <= count) return listElem[x].classList.add("isActive");
      if (toc[x].p <= count && count < toc[x + 1].p) return listElem[x].classList.add("isActive")
    });
  };
  // setImages(0);
  const setImages = (n) => {
    const x = store.getState().count;
    const single = store.getState().single;
    const combined = store.getState().combined;
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

  // 初期化
  // const observer = useObserver(single, combined, singleLimitWidth, setImages)
  const setUp = () => {
    console.log(setImages);
    console.log(store.getState());
    // store.getState().single;
    // console.log(amount, single, minCount, maxCount)
    // store.dispatch(setAmount(amount));
    // store.dispatch(setMinCount(minCount));
    // store.dispatch(setMaxCount(maxCount));

    // store 初期化
    if (vertical) {
      initVertical(vertical, chapterList, imageVerticalBox, images, tocHeight);
    } else {
      insertImageTag(single, imageBox);
      observer.observe(imageBox);
      setImages(0);
    }
  }
  store.subscribe(setUp);
  setUp();
  //
  // // page transition
  // const increment = (n) => c.count < maxCount && (c.count = Number(c.count) + n);
  // const decrement = (n) => c.count >= minCount && (c.count = Number(c.count) - n);
  // const directSet = (n) => c.count = n;
  // // +1ページ
  // const plusOne = () => increment(1);
  // // -1ページ
  // const minusOne = () => decrement(1);
  // // 次のページへ
  // const goNext = () => reverse ? decrement(amount) : increment(amount);
  // // 前のページへ
  // const goPrevious = () => reverse ? increment(amount) : decrement(amount);
  // // 最初のページ=へ
  // const goStart = () => c.count > 0 && directSet(0);
  // // 最後のページへ
  // const goEnd = () => directSet(maxCount);
  // // 10ページ進む
  // const go10 = () => imgLen - c.count < 9 ? c.count = imgLen - Number(c.count) : increment(10);
  // // 10ページ戻る
  // const back10 = () => c.count < 9 ? c.count = c.count : decrement(10);
  // // 章ごとのジャンプ移動
  // const goChapterNum = (n) => toc && n <= toc.length && directSet(toc[n - 1].p); // v.toc[n - 1].p は not defined になる
  // // ◀クリックで次のページへ進む
  // arrowLeft.addEventListener('click', goNext, false);
  // // ▶クリックで前のページへ戻る
  // arrowRight.addEventListener('click', goPrevious, false);
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
  clickNext(arrowLeft);
  clickPrevious(arrowRight);

  // キー押下で前後ページ移動
  const a = { vertical, reverse, plusOne, minusOne, goNext, goPrevious, goStart, goEnd, go10, back10, goTopPage, goChapterNum, toggleToc };
  keyBindings(a);
  // });
}


