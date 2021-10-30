
# protobuf.js wechat 分支

为微信小程序或小游戏环境提供支持.
## 简介
基于官方 [protobufjs](https://github.com/protobufjs/protobuf.js) 修改而来.
修改的原因是微信 runtime 屏蔽了 Function 和 eval 等动态执行代码方式.故改造此类代码 <br/>
初始fork版本为 [官方 6.11.2](https://github.com/protobufjs/protobuf.js/tree/v6.11.2)

## 内容

* 安装<br />
  `npm i --save github:alkaid/protobufjs#v6.11.2-wechat.1`

* 使用<br />
  目前支持 [JSON descriptors](https://github.com/maxim-top/protobuf.js#using-json-descriptors) 模式
  ，使用前先用 `pbjs -t json `将 .proto 转为 .json<br/>
  导入:<br/>
  `import protobuf from 'protobufjs/light';`

* 已知问题<br />
  * cli 工具集的 source 和 bin 不同步,但请放心使用 cli 工具，因为bin是官方版本,并没有用改动后的source重编译.具体原因如下:
    本工程旨在抹除动态代码以适配微信 runtime ，而 cli 工具集依赖这些动态代码生成函数来生成 static 代码,所以本分支的 cli 代码无法使用,当然也不会进行重新编译.
* TODO LIST
  * rpc支持