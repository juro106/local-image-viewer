/*
 * 以下のようなオブジェクトの配列データを作りたい
 * { url: string, title: string, info: {}, volumes: {}, images: [] }
 */
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const getImages = (dirPath) => {
  // const filelist = await fs.promises
  //   .readdir(dirPath, { withFileTypes: true })
  //   .then((dirents) => dirents
  //     .filter((dirent) => dirent.isFile())
  //     .map(({ name }) => {
  //       const ext = path.extname(name);
  //       const type = mime.lookup(ext);
  //       if (type && /^image\//.test(type)) return path.join(dirPath, name)
  //     }).filter(v => v))
  //   .catch((err) => console.error(err));
  // return filelist
  const files = fs.readdirSync(dirPath)
  const images = files.map(file => {
    const ext = path.extname(file);
    const type = mime.lookup(ext);
    if (type && /^image\//.test(type)) {
      const filepath = path.join(dirPath, file);
      return filepath;
    }
  }).filter(v => v);

  return images;
};

const getData = (path) => {
  if (fs.existsSync(path)) {
    const f = require(path);
    return f.func();
  } else {
    return undefined;
  }
  // const obj = f.func();
  // return obj;
};


const main = () => {
  // const basePath = '/media/kenichiro/ext-hdd/develop/manga';
  const basePath = require('../.env');
  const dst = path.join(__dirname, `./data.json`);
  const cpDst = path.join(__dirname, `../dst/_assets/data/index.js`);
  // const f = require(`${basePath}/static/data/index.js`);
  const works = require('./works.json');
  // f.func();
  // console.log(works);
  // const imagesPath = `${basePath}/aot/images/`;
  // const dirList = fs.readdirSync(imagesPath);

  const list = works.map(v => {
    // images
    const imagesPath = `${basePath}/${v.url}/images`;
    const cover = fs.existsSync(`${basePath}/${v.url}/cover`);
    const favicon = fs.existsSync(`${basePath}/${v.url}/favicon.png`);
    const dirList = fs.readdirSync(imagesPath);
    const imagesList = dirList.map(v => {
      const dirPath = `${imagesPath}/${v}`;
      const images = getImages(dirPath);
      const ext = path.extname(images[0]);
      return { volume: v, images: images.length, ext };
    });
    // console.log(imagesList); // 最終的にほしいのはこれ。dirListは不要

    // data(info, volumes)
    const dataPath = `${basePath}/${v.url}/data/index.js`;
    const data = getData(dataPath);
    let newVolumes = {};
    imagesList.forEach(v => {
      newVolumes[v.volume] = { count: v.images, ext: v.ext };
      const z = data && data.volumes[v.volume];
      if (z && z.toc) {
        newVolumes[v.volume].toc = z.toc
      }
      if (z && z.combined) {
        newVolumes[v.volume].combined = z.combined
      }
      if (z && z.reverse) {
        newVolumes[v.volume].reverse = z.reverse
      }
      if (z && z.vertical) {
        newVolumes[v.volume].vertical = z.vertical
      }
    });

    const info = data && data.info ? data.info : undefined;

    return {
      url: v.url,
      title: v.title,
      info,
      cover,
      favicon,
      volumes: newVolumes,
      // images: imagesList
    };
  });

  const obj = list.reduce((obj, data) => ({ ...obj, [data.url]: data }), {});
  const json = JSON.stringify(obj);
  // console.log(obj);


  // fs.writeFile(dst, json, (err) => {
  //   if (err) throw err;
  // });
  fs.writeFileSync(dst, json);
  console.log('complete write json file');
  fs.writeFileSync(cpDst, `const basePath='${basePath}';const data = `);
  fs.appendFile(cpDst, json, (err) => {
    if (err) throw err;
    console.log('complete write obj file');
  });
}

main();

