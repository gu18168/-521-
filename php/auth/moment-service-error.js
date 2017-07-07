'use strict';

/**
 * Created by ATOM.
 * User: Nick Gu
 * Date: 2017/6/29
 * Time: 23:05
 */
class MomentServiceError extends Error {
    constructor(type, message) {
        super(message);

        this.type = type;
        this.message = message;
    }
}

module.exports = MomentServiceError;
