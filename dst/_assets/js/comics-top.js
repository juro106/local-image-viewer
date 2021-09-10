'use-strict';
// comics-top
document.addEventListener('DOMContentLoaded', () => {
  const d = data[dirName];
  const title = d.title;
  document.title = title;
  favicon.href = d.favicon ? `${basePath}/${dirName}/favicon.png` : `${basePath}/favicon.png`;
  // const dummy = onerror="this.src='${basePath}/dummy.png';" />
  const coverImgSrc = (cover, k) => cover
    ? `<img class='cover' src='${basePath}/${dirName}/cover/${k}.jpg' decoding='async' />`
    : `<img class='cover' src='${basePath}/${dirName}/images/${k}/000${d.volumes[k].ext}' decoding='async' />`;

  const Header = `<header><a href='../index.html' class='header-link'><div class='header-item'>Home</div></a><div id='counter'></div></header>`;
  const h1 = `<h1 id='page-title'>${title}</h1>`;
  const volumes = Object.keys(d.volumes).sort().map(k => (
    `<li class='comics-item'><a class='comics-item-link' href='./${k}.html'>
      ${coverImgSrc(d.cover, k)}
      <div class='volume-number'>${k}</div>
    </a></li>`
  ));
  const list = `<ul id='comics-list'>${volumes.join('')}</ul>`;
  root.innerHTML = Header + h1 + list;
});

document.body.addEventListener("keydown", (e) => {
  if (e.code === 'Escape') {
    e.preventDefault();
    location.href = "../index.html";
  }
});

