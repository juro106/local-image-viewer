'use strict';

// store
const createStore = (reducer) => {
  let state;
  let listeners = [];
  // getState はただ state を返すだけ
  const getState = () => state;
  // dispatch. reducer を呼んで state を更新する. subscribe で登録した処理を実行する
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  }
  // subscribe で dispatch時に呼ぶ処理を登録
  const subscribe = (listener) => {
    listeners.push(listener);
  }

  return { getState, dispatch, subscribe };
}

// Actions
const Increment = { type: 'INCREMENT' };
const Decrement = { type: 'DECREMENT' };

const setCount = (vari) => ({ type: 'SET_COUNT', payload: { vari } });
const directSet = (vari) => ({ type: 'SET_COUNT_DIRECT', payload: { vari } });

const setAmount = (amount) => ({ type: 'SET_AMOUNT', payload: { amount } });
const setMinCount = (minCount) => ({ type: 'SET_MIN_COUNT', payload: { minCount } });
const setMaxCount = (maxCount) => ({ type: 'SET_MAX_COUNT', payload: { maxCount } });
const setSingle = (single) => ({ type: 'SET_SINGLE', payload: { single } });
const setCombined = (combined) => ({ type: 'SET_COMBINED', payload: { combined } });
const setReverse = (reverse) => ({ type: 'SET_REVERSE', payload: { reverse } });
const initState = (count, amount, minCount, maxCount, imgLength, single, combined, reverse) => ({ type: 'INIT_STATE', payload: { count, amount, minCount, maxCount, imgLength, single, combined, reverse } });
const resetState = (amount, minCount, maxCount) => ({
  type: 'RESET_STATE',
  payload: { amount, minCount, maxCount }
});

// Reducer
const initialState = {
  amount: 0,
  count: 0,
  maxCount: 0,
  minCount: 0,
  imgLength: 0,
  combined: false,
  reverse: false,
  single: false,
}

const myReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + state.amount,
      };
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - state.amount,
      };
    case 'SET_COUNT':
      return {
        ...state,
        count: state.count + action.payload.vari,
      };
    case 'CHANGE_COUNT':
      return {
        ...state,
        count: state.count + action.payload.vari,
      };
    case 'SET_COUNT_DIRECT':
      return {
        ...state,
        count: action.payload.vari,
      };
    case 'SET_AMOUNT':
      return {
        ...state,
        amount: action.payload.amount,
      };
    case 'SET_MIN_COUNT':
      return {
        ...state,
        minCount: action.payload.minCount,
      };
    case 'SET_MAX_COUNT':
      return {
        ...state,
        maxCount: action.payload.maxCount,
      };
    case 'SET_SINGLE':
      return {
        ...state,
        single: action.payload.single,
      };
    case 'INIT_STATE':
      return {
        ...state,
        count: action.payload.count,
        amount: action.payload.amount,
        maxCount: action.payload.maxCount,
        minCount: action.payload.minCount,
        imgLength: action.payload.imgLength,
        single: action.payload.single,
        combined: action.payload.combined,
        reverse: action.payload.reverse,
      };
    case 'RESET_STATE':
      return {
        ...state,
        amount: action.payload.amount,
        maxCount: action.payload.maxCount,
        minCount: action.payload.minCount,
      };
    default:
      return state;
  }
}

const increment = (n) => {
  const count = store.getState().count;
  const maxCount = store.getState().maxCount;
  count < maxCount && store.dispatch(setCount(n));
}
const decrement = (n) => {
  const count = store.getState().count;
  const minCount = store.getState().minCount;
  count >= minCount && store.dispatch(setCount(n));
}

// 次のページへ
const goNext = () => {
  const amount = store.getState().amount;
  const reverse = store.getState().reverse;
  reverse ? decrement(amount) : increment(amount);
  console.log(store.getState());
}
// 前のページへ
const goPrevious = () => {
  const amount = store.getState().amount;
  const reverse = store.getState().reverse;
  reverse ? increment(amount) : decrement(-amount);
}

const plusOne = () => increment(1);
const minusOne = () => decrement(-1);

const go10 = () => {
  const count = store.getState().count;
  const imgLength = store.getState().imgLength;
  const amount = imgLength - count < 9 ? imgLength - count : 10;
  store.dispatch(setCount(amount));
}

const back10 = () => {
  const count = store.getState().count;
  const imgLength = store.getState().imgLength;
  const amount = count < 9 ? -count : -10;
  store.dispatch(setCount(amount));
}

// 最初のページ=へ
const goStart = () => directSet(0);
// 最後のページへ
const goEnd = (maxCount) => directSet(maxCount);
// 
const goChapterNum = (n) => toc && n <= toc.length && directSet(toc[n - 1].p); // v.toc[n - 1].p は not defined になる
// ◀クリックで次のページへ進む
const clickNext = (target) => {
  target.addEventListener('click', goNext, false);
}
// ▶クリックで前のページへ戻る
const clickPrevious = (target) => {
  target.addEventListener('click', goPrevious, false);
}
// マウスホイールで前後ページ移動
const mouseWheel = (vertical) => {
  window.addEventListener("mousewheel", (e) => {
    if (vertical) return;
    e.wheelDelta < 0 ? goNext() : goPrevious();
  });
}
// index ページへ戻る
const goTopPage = (e) => {
  e.preventDefault(); // ctrl + r など他のキーバインドは潰したくないので個別に指定
  location.href = "./index.html";
};

const toggleSingle = () => {
  const currentSingle = store.getState().single;
  const imgLength = store.getState().imgLength;
  // console.log('current single', currentSingle);
  store.dispatch(setSingle(currentSingle ? false : true));
  store.dispatch(setAmount(currentSingle ? 2 : 1));
  store.dispatch(setMinCount(currentSingle ? 2 : 1));
  store.dispatch(setMaxCount(currentSingle ? imgLength - 2 : imgLength - 1));
}

const store = createStore(myReducer);

const storeInit = () => {
  const count = 0;
  const combined = false;
  const reverse = false;
  const imgLength = 185;
  const single = combined ? true : false;
  const minCount = single ? 1 : 2;
  const maxCount = single ? imgLength - 1 : imgLength - 2;
  const amount = single ? 1 : 2;
  // store 初期化
  store.dispatch(initState(
    count,
    amount,
    minCount,
    maxCount,
    imgLength,
    reverse,
    combined,
    single,
  ));

  console.log(store.getState());
}

const setEventListener = () => {
  Incre.addEventListener('click', () => goNext());
  Decre.addEventListener('click', () => goPrevious());
  Add10.addEventListener('click', () => go10());
  Sub10.addEventListener('click', () => back10());
  Mode.addEventListener('click', () => toggleSingle());
};

const setImages = (count, images) => {
  const c1 = images[count]
  const c2 = images[count + 1];
  imageRight.src = c1;
  imageLeft.src = c2;
}

// rendering
document.addEventListener('DOMContentLoaded', () => {
  storeInit();

  const basePath = `/media/kenichiro/ext-hdd/develop/manga/aot/images/33`;
  const images = [...Array(store.getState().imgLength)].map((_, i) => {
    const num = ('000' + i).slice(-3);
    return `${basePath}/${num}.jpg`;
  });
  const imgArray = images.map(url => {
    const img = document.createElement("img");
    img.src = url;
    return img;
  });

  const Display = `<h2 id="Display">0</h2>`;
  const PageTitle = `<h1>クロージャ＆カリー化</h1>`;
  const Incre = `<button id='Incre'>+1</button>`;
  const Add10 = `<button id='Add10'>+10</button>`;
  const Decre = `<button id='Decre'>-1</button>`;
  const Sub10 = `<button id='Sub10'>-10</button>`;
  const Mode = `<button id='Mode'>mode</button>`;
  const imageBox = `
    <div id='imageBox' style="display:flex;width:100%;">
      <img id='imageLeft' src='' style="display:block;width:50%;"/>
      <img id='imageRight' src='' style="display:block;width:50%;" />
    </div>`;
  root.innerHTML = PageTitle + Display + Incre + Add10 + Decre + Sub10 + Mode + imageBox;
  setEventListener();

  const render = () => {
    const count = store.getState().count;
    document.getElementById('Display').innerText = count;
    setImages(count, images);
  }

  store.subscribe(render);

  render();
});


