var host = '你的服务器域名';

var config = {
  service: {
    host,
    loginUrl: `https://${host}/login`, //登录网址
    tunnelUrl: `https://${host}/tunnel`, //信道网址
    momentUrl: `https://${host}/moment`, //动态信道网址
    createUrl: `https://${host}/create`, //创建动态网址
    getUrl: `https://${host}/get`, //得到地图动态网址
    bindUrl: `https://${host}/bind`, //绑定账户网址
    activityUrl: `https://${host}/activity`, //得到活动网址
    usersUrl: `https://${host}/users`, //得到活跃用户网址
    momentsUrl: `https://${host}/moments`, //得到今日动态网址
    realUrl: `https://${host}/real`, //是否真实姓名绑定网址
    berealUrl: `https://${host}/bereal`, //绑定真实姓名网址
    confessionUrl: `https://${host}/confession`, //创建表白网址
    confessionsUrl: `https://${host}/confessions` //得到表白网址
  }
};

module.exports = config;
