define(["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.formatCurrency = formatCurrency;
    exports.formatAmount = formatAmount;
    exports.formatPercent = formatPercent;

    function formatCurrency(amount) {
        return amount.toLocaleString("vi", {
            style: "currency",
            currency: "VND"
        });
    }

    function formatAmount(amount) {
        return amount.toLocaleString("vi");
    }

    function formatPercent(amount) {
        return amount.toLocaleString("vi", { style: "percent" });
    }
});