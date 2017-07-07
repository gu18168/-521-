'use strict';

/**
 * Created by ATOM.
 * User: Nick Gu
 * Date: 2017/7/1
 * Time: 00:26
 */
const http = require('http');
const co = require('co');
const ServiceBase = require('../service-base');
const constants = require('./constants');
const momentApi = require('./moment-api');
const MomentAPIError = require('./moment-api-error');
const MomentServiceError = require('./moment-service-error');

class MomentService extends ServiceBase {
    create(callback) {
      const promise = co.wrap(function *() {
        try {
          const loc = this._getHeader(constants.WX_HEADER_LOC);
          const lng = this._getHeader(constants.WX_HEADER_LNG);
          const title = this._getHeader(constants.WX_HEADER_TITLE);

          const result = yield momentApi.createMoment(loc, lng, title);

          this.writeJsonResult({
              [constants.WX_SESSION_MAGIC_ID]: 1,
              session: {
                  uuid: result.uuid,
              },
          });

          return { 'uuid': result.uuid };
        } catch (err) {
          let error = new MomentServiceError(constants.ERR_CREATE_FAILED, err.message);
          this._writeError(error);
          throw error;
        }
      }).call(this);

      return this._promiseOrCallback(promise, callback);
    }

    get(callback) {
      const promise = co.wrap(function *() {
        try {
          const uuid = this._getHeader(constants.WX_HEADER_UUID);

          const result = yield momentApi.getMoment(uuid);

          return { 'uuid': result.uuid, 'lat': result.lat, 'lng': result.lng, 'title': result.title };
        } catch (err) {
          let error = new MomentServiceError(constants.ERR_GET_FAILED, err.message);
          this._writeError(error);
          throw error;
        }
      }).call(this);

      return this._promiseOrCallback(promise, callback);
    }

    _writeError(err) {
        if (this.res.headersSent) {
            return;
        }

        this.writeJsonResult({
            [constants.WX_SESSION_MAGIC_ID]: 1,
            error: err.type,
            message: err.message,
        });
    }

    _promiseOrCallback(promise, callback) {
        if (typeof callback !== 'function') {
            return promise;
        }

        promise.then(
            result => setTimeout(() => callback(null, result), 0),
            error => setTimeout(() => callback(error), 0)
        );
    }

    _getHeader(headerKey) {
        let headerValue = super.getHeader(headerKey);

        if (!headerValue) {
            throw new Error(`请求头未包含 ${headerKey}，这他娘的就尴尬了`);
        }

        return headerValue;
    }
}

module.exports = MomentService;
