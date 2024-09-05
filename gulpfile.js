/* En este archivo pones todas las tareas (funciones en js) a realizar por gulp */

//CSS Y SASS
const { src, dest, watch, series, parallel } = require('gulp'); //Importamos las dependecias del packjson
const sass = require('gulp-sass')(require('sass')); //Importamos 'gulp-sass' y 'sass'
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');
 
//Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css( done){
    //compilar sass
    //paso 1: identificar archivo, paso2: compilarla. paso3: guardar el .css

    src('src/scss/app.scss') //Paso 1
        .pipe(sourcemaps.init())
        .pipe( sass() )
        .pipe(postcss( [autoprefixer(),cssnano ])) //Paso 2
        .pipe( sourcemaps.write('.'))
        .pipe( dest('build/css') ) //Paso 3 'se guarda en la carpeta llamada 'build' 

    done();
}

function imagenes( done ){
    src('src/img/**/*')
        .pipe(imagemin({optimizationLevel: 3}) )
        .pipe(dest('build/img'));
    done();

}

function versionWebp(){
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png, jpg}')
        .pipe(webp(opciones) )
        .pipe(dest('build/img'))
}

function versionAvif(done){
    const opciones = {
        quality: 50
    }
    src('src/img/**/*.{png, jpg}')
        .pipe(avif(opciones) )
        .pipe(dest('build/img'))
    done();
}

function dev(){
   watch ('src/scss/**/*.scss', css);
   watch('src/img/**/*', imagenes );
}



exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series( imagenes, versionWebp,versionAvif, css, dev );

// series - se inicia una tarea y hasta que se finaliza, inicia la siguiente
//parallel - Todas inician al mismo tiempo