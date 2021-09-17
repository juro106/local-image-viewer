'use-strict';
// viewer
document.addEventListener('DOMContentLoaded', () => {
  const { title, info, volumes, favicon: Favicon } = data[dirName];
  const { toc, vertical, combined, count, ext } = volumes[vol]; // right [vol], wrong .vol
  const prefix = info && info.prefix && info.prefix;
  const suffix = info && info.suffix && info.suffix;

  document.title = vol + ' ' + title;
  favicon.href = Favicon ? `${basePath}/${dirName}/favicon.png` : `${basePath}/favicon.png`;

  const heading = `${title} - ${prefix ? prefix : ''}${vol}${suffix && vol !== 'name' ? suffix : ''}`;
  const chapterLink = toc && toc.map(v => `<li class='chapter-item' data-p=${v.p}><a href='#${v.p}' class='chapter-item-link'>${v.name}</a></li>`);
  const chapterItems = toc && toc.map(v => `<li class='chapter-item' data-p=${v.p}>${v.name}</li>`);
  const initialCount = count.toString();

  const Header = `<header><a href='./index.html' class='header-link'><div class='header-item'>${heading}</div></a><div id='Loading'></div><div id='counter-box'><span id='counter'>1</span><span>/${initialCount}<span></div></header>`;
  const ChapterList = chapterItems ? `<ul id='chapterList'>${vertical ? chapterLink.join('') : chapterItems.join('')}</ul>` : '';

  const ChapterListBox = ChapterList ? `<div id='chapter-list-box'><div id='TocHeader' class='toc'>TOC</div>${ChapterList && ChapterList}</div>` : '';
  const Controller = `<div id='controller'><div id='arrowLeft'>◀</div><div id='arrowRight'>▶</div></div>`;

  const ImageBox = vertical ? `<div id='imageVerticalBox'></div>` : `<div id='imageBox'></div>`;

  root.innerHTML = Header + ImageBox + ChapterListBox + Controller;

  // 最初に表示する2枚を先に読み込んでおく。初期表示がなめらかになる
  new Promise(resolve => {
    const img0 = new Image();
    const img1 = new Image();
    let load = 0;
    [img0, img1].forEach(e => {
      e.onload = () => {
        load += 1;
        load === 2 && resolve([img0, img1])
      }
    });
    img0.src = `${basePath}/${dirName}/images/${vol}/000${ext}`;
    img1.src = `${basePath}/${dirName}/images/${vol}/001${ext}`;
  }).then(image => {
    ImageBox.innerHTML = image[0] + image[1]
    init()
  });
});

