# gravitation - 万有引力

## 五子棋网络版V1.0
- 支持在线五子棋对战
- 支持聊天
- 核心设计可看pdf文件

### 服务端
- 采用Scala编写
- 网络框架采用Akk-Http
- 客户端采用长轮询(long-pooling)方式获取对手的动作/事件
- 代码在gravitation-open模块中

### 客户端
- 采用Python编写, 在python3.6版本上测试通过
- GUI框架采用Tkinter
- 代码在gravitation-client模块中, `python3.6 main.py`即可运行
