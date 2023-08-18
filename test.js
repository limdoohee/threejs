const imagemin = require("imagemin");
const webp = require("imagemin-webp");

//source 폴더의 png 파일들을 변환해서 images 폴더로 넣겠다.
//만약 images 폴더가 존재하지 않는 다면 생성됨
imagemin(["test/textures/*.{jpg,jpeg,png}"], "images", {
    use: [
        webp({
            quality: 50, //변환되는 webp의 퀄리티를 지정. 손실 있음. 75%.
        }),
    ],
}).then(function () {
    console.log("Images converted!"); //완료되었을때 로그
});

// import imagemin from "imagemin";
// import imageminWebp from "imagemin-webp";

// await imagemin(["test/textures/*.{jpg,jpeg,png}"], {
//     destination: "build/images",
//     plugins: [imageminWebp({ quality: 50 })],
// });

// console.log("Images optimized");
