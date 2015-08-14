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
