import DISPATCHER from "./dispatcher";
import $ from "jquery";


DISPATCHER.on("noti:close", (eventName) => {
    $.notify("Mất kết nối với máy chủ! Vui lòng tải lại trang.", {className: "error"});
});

DISPATCHER.on("noti:error", (eventName) => {
    $.notify("Có vấn đề khi kết nối với máy chủ! Vui lòng tải lại trang.", {className: "error"});
});

DISPATCHER.on("noti:deal:created", (eventName) => {
	$.notify("Đã mua cổ phiếu mới!");
});
