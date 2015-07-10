fis-pure
====

基于FIS的纯前端模块化解决方案pure。

**建议刚接触这个方案的同学直接使用 [FIS3](https://github.com/fex-team/fis3) 而非 pure，FIS3可以更轻松的实现 pure 的功能。**

pure是基于FIS二次封装能力封装而成的解决方案，可以直接使用，也可以参考fis-pure自行封装或组合使用插件来构建属于自己的一体化解决方案。

> 因为很重要，所以写在最前面

如果希望在pure的基础上添加自己的目录规范，即修改 `roadmap.path` 时，**不可以** 使用fis.config.merge或者fis.config.set，而必须按照下面的方式进行配置

```javascript
fis.config.get('roadmap.path').unshift({
    reg: 'map.json',
    release: false
});
```

roadmap的配置具体可以参考 [roadmap详解](http://fis.baidu.com/docs/advance/roadmap.html)

## 目录
* [模块化开发](#模块化开发)
* [组件生态](#组件生态)
* [自动性能优化](#自动性能优化)
* [前端语言支持](#前端语言支持)
* [简化环境安装](#简化环境安装)
* [如何使用](#如何使用)
  * [安装](#安装)
  * [快速上手](#快速上手)
  * [模块化加载](#模块化加载)
  * [目录规范](#目录规范)
  * [配置](#配置)
  * [更多资料](#更多资料)


## 模块化开发

* 不仅仅是脚本模块化，pure带给你模版、脚本、样式的组件化方案。
* 自动加载模块化依赖，无需手动引入静态资源。
* 与Node.js风格一致的模块化开发体验，告别 ```define```。

## 组件生态

使用 `pure install` 命令可以下载[fis-components](https://github.com/fis-components)组件，在业务代码中可以直接通过 `require` 使用。

```bash
pure install zepto
```

```javascript
var $ = require('zepto');
```

## 自动性能优化

pure可以自动压缩、合并页面引用到的所有资源，配置灵活，一个命令完成性能优化，轻松实践雅虎14条优化规则。并且这一切优化无需**任何**后端框架或服务支持。

## 前端语言支持

* 直接编写less文件，无需额外编译工具支持。
* 可以直接在脚本中通过 ```var template = __inline('path/to/template.tmpl'); ``` 引用经过了预编译的underscore模版，无需异步请求和解析。
* 更多的前端语言支持可以参考[辅助开发](http://fis.baidu.com/docs/beginning/assist.html)

## 本地调试环境

* 通过 `pure server start` 就能开启本地调试服务器。
* 通过 `pure release --watch --live` 实现监听文件修改，自动刷新页面等功能。更多内容可以参考[辅助开发](http://fis.baidu.com/docs/beginning/assist.html)。

## 如何使用

### 安装
* 安装 [nodejs&npm](http://nodejs.org/)
* 安装pure

   ```bash
    npm install fis-pure -g
    pure -v
   ```

### 快速上手

快速上手请参考[前端模块化](http://fis.baidu.com/docs/advance/modjs-solution.html)

开发angular应用还可以参考[pure-angular-demo](https://github.com/hefangshi/pure-angular-demo)

### 模块化加载

如何使用模块化加载可以参考[fis-pure-demo](https://github.com/hefangshi/fis-pure-demo)，大致需要以下几个步骤

* 在需要模块化资源管理的页面，如index.html中引用[Mod](https://github.com/fex-team/mod)，注意[Mod](https://github.com/fex-team/mod)需放在lib文件夹内，因为这是模块化加载库，不能被模块化。 [示例](https://github.com/hefangshi/fis-pure-demo/blob/master/index.html#L7)
* modules目录下添加页面脚本，如`main.js`，在页面中则可以通过`require('main')`加载静态资源。 [示例](https://github.com/hefangshi/fis-pure-demo/blob/master/index.html#L31-L33)
* 需要引用其他模块，以jquery.js为例，只要在modules目录中添加代码，在main.js中就可以通过`var $ = require('jquery')`加载，在通过`pure release`发布后，页面就会自动加载jquery.js与main.js。

#### 使用变量来异步加载模块化代码

我们经常会遇到有些应用场景需要通过运行时的变量来决定异步加载哪些模块，由于 pure 的依赖分析均在编译期完成，无法知道变量可能的值有哪些。因此为了实现这个目标，需要手动在使用变量加载异步变量的脚本中添加一些异步依赖的注释。

```javascript
/**
* @require.async page/detail
*/
```

### 目录规范

pure自带了一个非常简单的目录规范

* 所有组件化的脚本、样式、图片均放在modules目录中，可以按照组件划分目录，非模块化的脚本放在lib目录中。
* page目录下的页面文件会发布到根目录，静态资源会发布到static目录。
* pure install获得的组件保存在components目录

任何 ``目录规范``、``部署规范``、``编译规范`` 都是可配置的（[配置代码](https://github.com/fex-team/fis-pure/blob/master/pure.js#L27-L74)）。

> 如果希望调整目录规范，建议将[配置代码](https://github.com/fex-team/fis-pure/blob/master/pure.js#L27-L74)中roadmap.path的部分整体复制到项目的fis-conf.js中再进行调整，避免配置不符合预期的问题。

内置的规范包括：

1. ``modules`` 目录下的js、css、less文件都是模块化文件，脚本会自动包装define，无需手动添加。使用require.async或者require加载模块的时候id与文件的对应规则是这样的：
<table>
    <tr>
        <td>文件</td>
        <td>引用id</td>
        <td>举个例子</td>
    </tr>
    <tr>
        <td>/modules/main.js</td>
        <td>main</td>
        <td>var main = require('main');</td>
    </tr>
    <tr>
        <td>/modules/jquery/jquery.js</td>
        <td>jquery</td>
        <td>var $ = require('jquery');</td>
    </tr>
    <tr>
        <td>/modules/jquery/jquery.scroll.js</td>
        <td>jquery/jquery.scroll</td>
        <td>require('jquery/jquery.scroll');</td>
    </tr>
</table>

1.  ``lib`` 目录下的文件不被认为是模块化的，请直接在页面上使用script或link标签引用。

### 配置

参考[fis配置](http://fis.baidu.com/docs/api/fis-conf.html)

## 更多资料

* [fis](https://github.com/fex-team/fis)
* [fis-plus](https://github.com/fex-team/fis-plus)
* [gois](https://github.com/xiangshouding/gois)
* [spmx](https://github.com/fouber/spmx/)
* [phiz](https://github.com/fouber/phiz/)
