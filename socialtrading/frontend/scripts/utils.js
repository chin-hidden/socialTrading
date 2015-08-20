export function formatCurrency(amount) {
    if (amount === undefined) {
        amount = NaN;
    }
    return amount.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
    });
}

export function formatAmount(amount) {
    if (amount === undefined) {
        amount = NaN;
    }
    return amount.toLocaleString("vi");
}

export function formatPercent(amount) {
    if (amount === undefined) {
        amount = NaN;
    }
    return amount.toLocaleString("vi", {style: "percent"});
}

export function dealStatusName(status) {
    var map = {
        "BUYING:PendingNew": "Chờ mua",
        "BUYING:PartialFilled": "Đang mua",
        "BUYING:Filled": "Đã mua",
        "SELLING:PendingNew": "Chờ bán",
        "SELLING:PartialFilled": "Đang bán",
        "SELLING:Filled": "Đã bán",
    };

    if (status in map) {
      return map[status];
    } else {
      return "Không rõ"
    }
}
