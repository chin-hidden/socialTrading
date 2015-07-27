export function formatCurrency(amount) {
    return amount.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
    });
}

export function formatAmount(amount) {
	return amount.toLocaleString("vi");
}

export function formatPercent(amount) {
	return amount.toLocaleString("vi", {style: "percent"});
}
