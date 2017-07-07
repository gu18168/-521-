'use strict';
/**
 * Created by ATOM.
 * User: Nick Gu
 * Date: 2017/6/29
 * Time: 23:29
 * @todo: 错误代码更新
 */
module.exports = {
    WX_HEADER_LOC: 'X-WX-LOC',
    WX_HEADER_LNG: 'X-WX-LNG',
    WX_HEADER_TITLE: 'X-WX-TITLE',
    WX_HEADER_WORD: 'X-WX-WORD',
    WX_HEADER_UUID: 'X-WX-UUID',

    WX_SESSION_MAGIC_ID: 'F2C224D4-2BCE-4C64-AF9F-A6D872000D1A',

    ERR_CREATE_FAILED: 'ERR_CREATE_FAILED',
    ERR_GET_FAILED: 'ERR_GET_FAILED',

    INTERFACE_CREATE: 'qcloud.cam.create_moment',
    INTERFACE_GET: 'qcloud.cam.get_moment',

    RETURN_CODE_SUCCESS: 0,
    RETURN_CODE_SKEY_EXPIRED: 60011,
    RETURN_CODE_WX_SESSION_FAILED: 60012,
};
