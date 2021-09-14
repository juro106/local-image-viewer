'use strict';

// store
const myCreateStore = (reducer) => {
  let state;
  let listeners = [];
  // getState はただ state を返すだけ
  const getState = () => state;

  // dispatch. reducer を呼んで state を更新する
  // subscribe で登録した処理を実行する
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
const initState = (amount, minCount, imgLength, maxCount, single, combined, reverse) => ({ type: 'INIT_STATE', payload: { amount, minCount, imgLength, maxCount, single, combined, reverse } });
const resetState = (amount, minCount, maxCount) => ({
  type: 'RESET_STATE',
  payload: { amount, minCount, maxCount }
});

// Reducer
const initialState = {
  amount: 0,
  count: 0,
  minCount: 0,
  maxCount: 0,
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
      return Object.assign({}, state, {
        count: state.count - state.amount,
      });
    case 'SET_COUNT':
      return {
        ...state, count: state.count + action.payload.vari,
      };
    case 'CHANGE_COUNT':
      return {
        ...state, count: state.count + action.payload.vari,
      };
    case 'SET_COUNT_DIRECT':
      return {
        ...state, count: action.payload.vari,
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
        amount: action.payload.amount,
        maxCount: action.payload.maxCount,
        imgLength: action.payload.imgLength,
        minCount: action.payload.minCount,
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
}
// 前のページへ
const goPrevious = () => {
  const amount = store.getState().amount;
  const reverse = store.getState().reverse;
  reverse ?  increment(amount) : decrement(amount);
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

const store = myCreateStore(myReducer);


// rendering
document.addEventListener('DOMContentLoaded', () => {
  /*
   * 必要な引数
   * single: boolean,
   * minCount: 1 || 2,
   * maxCount: imgArrayLength -1 || imgArrayLength - 2,
   * num: number,
  */
  // let combined = false;
  // let reverse = false;
  // let imgLength = 196;
  // let single = combined ? true : false;
  // let minCount = single ? 1 : 2;
  // let maxCount = single ? imgLength - 1 : imgLength - 2;
  // let amount = single ? 1 : 2;

  // store 初期化
  // store.dispatch(initState(
  //   amount,
  //   minCount,
  //   maxCount,
  //   imgLength,
  //   reverse,
  //   combined,
  //   single,
  // ));
  //
  // const render = () => {
  //   console.log(store.getState());
  //   const count = store.getState().count;
  //   StoreCount.innerText = count;
  // }
  // store.subscribe(render);
  //
  // render();
});
