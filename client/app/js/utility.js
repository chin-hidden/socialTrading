function formatCurrency(amount) {
    return amount.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
    });
}

function formatAmount(amount) {
	return amount.toLocaleString("vi");
}

function formatPercent(amount) {
	return amount.toLocaleString("vi", {style: "percent"});
}