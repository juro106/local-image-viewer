'use-strict';
// viewer
document.addEventListener('DOMContentLoaded', () => {
  const d = data[dirName];
  const {toc, vertical, count, ext} = d.volumes[vol]; // right [vol], wrong .vol
  const prefix = d.info && d.info.prefix && d.info.prefix;
  const suffix = d.info && d.info.suffix && d.info.suffix;
  const title = vol + ' ' + d.title;
  document.title = title;
  favicon.href = d.favicon ? `${basePath}/${dirName}/favicon.png` : `${basePath}/favicon.png`;

  const heading = `${d.title} - ${prefix ? prefix : ''}${vol}${suffix && vol !== 'name' ? suffix : ''}`;
  const chapterLink = toc && toc.map(v => `<li class='chapter-item' data-p=${v.p}><a href='#${v.p}' class='chapter-item-link'>${v.name}</a></li>`);
  const chapterItems = toc && toc.map(v => `<li class='chapter-item' data-p=${v.p}>${v.name}</li>`);
  const initialCount = count.toString();

  const Header = `<header><a href='./index.html' class='header-link'><div class='header-item'>${heading}</div></a><div id='Loading'></div><div id='counter-box'><span id='counter'>0</span><span>/${initialCount}<span></div></header>`;
  const ChapterList = chapterItems ? `<ul id='chapterList'>${vertical ? chapterLink.join('') : chapterItems.join('')}</ul>` : '';

  const ChapterListBox = ChapterList ? `<div id='chapter-list-box'><div id='TocHeader' class='toc'>TOC</div>${ChapterList && ChapterList}</div>` : '';
  const Controller = `<div id='controller'><div id='arrowLeft'>◀</div><div id='arrowRight'>▶</div></div>`;

  const ImageBox = vertical ? `<div id='imageVerticalBox'></div>` : `<div id='imageBox'></div>`;

  // 最初に表示する2枚を先に読み込んでおく。初期表示がなめらかになる
  const insertFirstImagePromise = () => {
    return new Promise(resolve => {
      const img0 = new Image();
      const img1 = new Image();
      img0.src = `${basePath}/${dirName}/images/${vol}/000${ext}`;
      img1.src = `${basePath}/${dirName}/images/${vol}/001${ext}`;
      const resolveFunc = () => {
        resolve([img0, img1]);
      }
      loadAllCallback([img0, img1], resolveFunc, false);
    });
  }
  const firstView = () => {
    insertFirstImagePromise().then((image) => {
      ImageBox.innerHTML = image[0] + image[1];
      init();
    });
  }
  root.innerHTML = Header + ImageBox + ChapterListBox + Controller;
  firstView();
});

