let websock = '' //用于初始化为一个webSocket实例
let wsuri = "ws://127.0.0.1:8081/test"; //连接地址
let requireData = "接收到服务端发送的数据:" //用于接收服务器返回的数据

export function initWebSocket() {
  //初始化weosocket
  // 以    ws://服务器地址/webSocket  路由的形式建立连接
  websock = new WebSocket(wsuri);
  websock.onmessage = websocketOnMessage();
  websock.onopen = websocketOnOpen();
  websock.onerror = websocketOnError();
  websock.onclose = websocketClose();
}
//连接建立之后执行send方法发送数据
export function websocketOnOpen() {
  let actions = {
    sendCustomData: "建立连接后，客户端自动发送数据****到服务端"
  };
  websocketsend(actions);
}
//连接建立失败重连
export function websocketOnError() {
  initWebSocket();
}
//接收服务端数据
export function websocketOnMessage(e) {
  const redata = e.data;
  requireData = requireData + "\n" + redata;
  console.log("接收到服务端发送的数据：", redata);
}
//客户端发送数据
export function websocketsend(Data) {
  websock.send(Data);
}
//关闭webSocket连接
export function websocketClose(e) {
  console.log("关闭webSocket连接：", e);
}
