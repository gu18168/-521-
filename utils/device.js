var DEVICE_KEY = '521_device';

var Device = {
    get: function () {
        return wx.getStorageSync(DEVICE_KEY) || null;
    },

    set: function (device) {
        wx.setStorageSync(DEVICE_KEY, device);
    },

    clear: function () {
        wx.removeStorageSync(DEVICE_KEY);
    },
};

module.exports = Device;