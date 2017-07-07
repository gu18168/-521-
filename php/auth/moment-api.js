'use strict';

/**
 * Created by ATOM.
 * User: Nick Gu
 * Date: 2017/6/29
 * Time: 23:26
 */
const co = require('co');
const constants = require('./constants');
const MomentAPIError = require('./moment-api-error');
const config = require('../../config');
const net = require('../helper/net');
const debug = require('../helper/debug');

module.exports = {
    createMoment(loc, lng, title) {
        let param = { loc, long, title };
        return this._sendRequest(constants.ININTERFACE_CREATE, param);
    },

    getMoment(uuid) {
        return this._sendRequest(constants.INTERFACE_GET, uuid);
    },

    _sendRequest: co.wrap(function *(apiName, apiParam) {
        let url = config.getAuthServerUrl();
        let data = this._packReqData(apiName, apiParam);

        let params = { url, 'body': data };

        let begin = Date.now();
        let result = yield net.jsonPost(params);
        let end = Date.now();

        let statusCode = result[0].statusCode;
        let body = result[1];

        // 记录请求日志
        debug(`POST ${url} => [${statusCode}]`, {
            '[请求]': data,
            '[响应]': body,
            '[耗时]': `${end - begin}ms`,
        });

        if (statusCode !== 200) {
            throw new Error('请求鉴权 API 失败，网络异常或鉴权服务器错误');
        }

        if (!body || typeof body !== 'object' || !('returnCode' in body)) {
            throw new Error('鉴权服务器响应格式错误，无法解析 JSON 字符串');
        }

        if (body.returnCode !== constants.RETURN_CODE_SUCCESS) {
            throw new MomentAPIError(body.returnCode, `鉴权服务调用失败：${body.returnCode} - ${body.returnMessage}`);
        }

        return body.returnData;
    }),

    _packReqData(api, param) {
        return {
            'version': 1,
            'componentName': 'MA',
            'interface': {
                'interfaceName': api,
                'para': param,
            },
        };
    },
};
