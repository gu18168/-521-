var host = '32225311.qingchun521qcloud.com';

var config = {
  service: {
    host,
    loginUrl: `https://${host}/login`,
    tunnelUrl: `https://${host}/tunnel`,
    momentUrl: `https://${host}/moment`,
    createUrl: `https://${host}/create`,
    getUrl: `https://${host}/get`,
    bindUrl: `https://${host}/bind`,
    activityUrl: `https://${host}/activity`,
    usersUrl: `https://${host}/users`,
    momentsUrl: `https://${host}/moments`,
    realUrl: `https://${host}/real`,
    berealUrl: `https://${host}/bereal`
  }
};

module.exports = config;
