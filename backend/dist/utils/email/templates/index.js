"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPasswordResetEmailTemplate = exports.getWelcomeEmailTemplate = void 0;
var welcomeEmail_1 = require("./welcomeEmail");
Object.defineProperty(exports, "getWelcomeEmailTemplate", { enumerable: true, get: function () { return welcomeEmail_1.getWelcomeEmailTemplate; } });
var passwordResetEmail_1 = require("./passwordResetEmail");
Object.defineProperty(exports, "getPasswordResetEmailTemplate", { enumerable: true, get: function () { return passwordResetEmail_1.getPasswordResetEmailTemplate; } });
