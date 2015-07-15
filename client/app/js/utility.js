function formatVNCurrency(amount) {
    return amount.toLocaleString("vi", {
        style: "currency",
        currency: "VND",
    });
}
