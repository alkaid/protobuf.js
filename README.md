
# protobuf.js wechat 分支

为微信小程序或小游戏环境提供支持.
## 简介
基于官方 [protobufjs](https://github.com/protobufjs/protobuf.js) 修改而来.
修改的原因是微信 runtime 屏蔽了 Function 和 eval 等动态执行代码方式.故改造此类代码 <br/>
初始fork版本为 [官方 6.11.2](https://github.com/protobufjs/protobuf.js/tree/v6.11.2)

## 内容

* 安装<br />
  `npm i --save github:alkaid/protobuf.js#wechat` //分支最新<br/>
  或者<br/>
  `npm i --save github:alkaid/protobuf.js#v6.11.2-wechat.1` //指定release tag

* 使用<br />
  * 目前支持 [JSON descriptors](https://github.com/maxim-top/protobuf.js#using-json-descriptors) 模式
  ，使用前先用 `pbjs -t json `将 .proto 转为 .json<br/>
  * ts中导入:<br/>
  `import protobuf from 'protobufjs/light.js';`
  * cli 工具集不受影响可正常使用(将改动前的库代码拷贝了一份到cli/origin_src,然后所有 cli 中的 protobuf 引用都指向了它)
* TODO LIST
  * rpc支持