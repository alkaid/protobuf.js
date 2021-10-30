# Changelog

### [6.11.2.1](https://www.github.com/protobufjs/protobuf.js/compare/v6.11.1...v6.11.2) (2021-10-30)

### Features
* 支持微信小程序或小游戏环境中使用protobufjs/light版本。
因为微信环境中不支持Function()和eval()动态函数,需要进行去Function的改造。
这里基于官方tag v6.11.2创建分支wechat,合并alkaid/protobufjs.wechat v0.0.2(这个改造版本应该是基于官方v6.8.6)的相关代码后，
再对比官方v6.8.6->v6.11.2中相关动态函数的diff后根据diff继续改造相关动态代码。
  
### Dependencies
* [官方 6.11.2](https://github.com/protobufjs/protobuf.js/tree/v6.11.2)
* [ 基于6.8.6的微信改造版本 ](https://github.com/alkaid/protobufjs.wechat/tree/v0.0.2)
* [官方 6.8.6->6.11.2 diff](https://github.com/alkaid/protobuf.js/compare/6.8.6...protobufjs:v6.11.2#diff-444e086c8038faf674140e30c0597966b9a9102859bf04422d247118adedd08c)

### Issue knows
* cli工具集的source和bin不同步,bin是官方版本,为了使bin可用,没有用改动后的source重编译.具体原因如下:
  由于本工程旨在抹除动态代码以适配微信环境，而cli工具集依赖这些动态代码生成函数来生成static代码,所以本分支的cli代码无法使用,也并不会进行重新编译,还是原官方版本的bin.