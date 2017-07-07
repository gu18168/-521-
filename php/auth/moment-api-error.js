'use strict';

/**
 * Created by ATOM.
 * User: Nick Gu
 * Date: 2017/6/29
 * Time: 22:58
 */
class MomentAPIError extends Error {
    constructor(code, message) {
        super(message);

        this.code = code;
        this.message = message;
    }
}

module.exports = MomentAPIError;
