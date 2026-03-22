"use strict";
const rules_1 = require("./rules");
const recommended_1 = require("./configs/recommended");
const plugin = {
    rules: rules_1.rules,
    configs: {
        recommended: recommended_1.recommended,
    },
};
module.exports = plugin;
