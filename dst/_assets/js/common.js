'use-strict';

let dirName, vol;

document.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname.split('/').slice(-2);
  dirName = path[0]; 
  vol = path[1].split('.')[0]; 
  // console.log(dirName);
  // console.log(vol);
});

