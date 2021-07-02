Настройка проекта из 09 спринта (сервис "Место") для сборки и деплоя с помощью Webpack
=====

### Ссылка на страницу: https://ev-shamko.github.io/servis-mesto  - контент не отобразится, если сервер сейчас отключён

Это тренировочный проект онлайн-курса Я.Практикума по веб-разработке. 
В текущем виде сборки будут собираться только на Windows, используя пакет cross-env.

* Сборка build: собирает файлы, которые в дальнейшем можно залить на сервер.
* Сборка dev: сайт запускается на локальном сервере и автообновляется, если внести изменения в какой-либо файл.
* Сборка deploy: заливает на Gihub в ветку gh-pages содержимое локальной папки dist.

#### Технологии:
```
JS, CSS, HTML, WebPack, GIT
```

#### Модули:
```
        "@babel/cli": "^7.10.1",
        "@babel/core": "^7.10.2",
        "@babel/preset-env": "^7.10.2",
        "autoprefixer": "^9.8.0",
        "babel-loader": "^8.1.0",
        "cross-env": "^7.0.2",
        "css-loader": "^3.5.3",
        "cssnano": "^4.1.10",
        "file-loader": "^6.0.0",
        "gh-pages": "^2.2.0",
        "html-webpack-plugin": "^4.3.0",
        "image-webpack-loader": "^6.0.0",
        "mini-css-extract-plugin": "^0.9.0",
        "optimize-css-assets-webpack-plugin": "^5.0.3",
        "postcss-loader": "^3.0.0",
        "style-loader": "^1.2.1",
        "webpack": "^4.43.0",
        "webpack-cli": "^3.3.11",
        "webpack-dev-server": "^3.11.0",
        "webpack-md5-hash": "0.0.6"
        "babel-polyfill": "^6.26.0",
        "core-js": "^3.4.1"
```
