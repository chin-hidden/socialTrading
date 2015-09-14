import Backbone from "backbone";
import SockJS from "sockjs-client";


export var NotificationStore = function(address) {
    this.conn = new SockJS(address);

    this.conn.onopen = (e) => {
        this.trigger("open", e);
    };

    this.conn.onmessage = (e) => {
        this.trigger("noti:" + e.data.headers.topic, e.data.payload);
    };

    this.conn.onclose = (e) => {
        this.trigger("close", e);
    };

    this.conn.onError = (e) => {
        this.trigger("error", e);
    };
}

Object.assign(NotificationStore.prototype, Backbone.Events);

NotificationStore.prototype.close = () => {
    this.conn.close();
};


export var notificationStore = new NotificationStore("/realtime");

notificationStore.on("noti:deal:created", () => {
    $.notify("Đã mua cổ phiếu mới!");
});

notificationStore.on("close", () => {
    $.notify("Mất kết nối với máy chủ! Vui lòng tải lại trang.", {className: "error"});
});

notificationStore.on("error", () => {
    $.notify("Có vấn đề khi kết nối với máy chủ! Vui lòng tải lại trang.", {className: "error"});
});
