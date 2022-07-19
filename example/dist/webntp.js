"use strict";
var WebNTP;
(function (WebNTP) {
    class Connection {
        constructor(url) {
            this.url = url;
        }
        async open() {
            return new Promise(resolve => {
                const conn = new WebSocket(this.url, ['webntp.shogo82148.com']);
                this.connection = conn;
                conn.addEventListener('open', () => {
                    resolve(conn);
                });
                conn.addEventListener('message', ev => {
                    this.onmessage(ev);
                });
                conn.addEventListener('error', ev => {
                    this.onerror(ev);
                });
                conn.addEventListener('close', ev => {
                    this.onclose(ev);
                });
            });
        }
        onmessage(ev) {
            const response = JSON.parse(ev.data);
            const end = performance.now();
            if (this.start === undefined)
                return;
            const delay = end - this.start;
            const offset = response.st * 1000 - Date.now() + delay / 2;
            if (this.resolve !== undefined) {
                this.resolve({
                    delay: delay,
                    offset: offset,
                });
                this.resolve = undefined;
            }
            if (this.connection !== undefined) {
                this.connection.close();
                this.connection = undefined;
            }
        }
        onerror(ev) {
            console.log(ev);
        }
        onclose(ev) {
            console.log(ev);
        }
        async get() {
            const conn = await this.open();
            const it = Date.now() / 1000;
            this.start = performance.now();
            conn.send(it.toString());
            return new Promise(resolve => {
                this.resolve = resolve;
            });
        }
    }
    class Client {
        constructor() {
            // connection pool
            this.pool = new Map();
        }
        // get_connection from the pool
        get_connection(url) {
            let c = this.pool.get(url);
            if (c !== undefined) {
                return c;
            }
            // create new connection
            c = new Connection(url);
            this.pool.set(url, c);
            return c;
        }
        async get(url) {
            return this.get_connection(url).get();
        }
    }
    WebNTP.Client = Client;
})(WebNTP || (WebNTP = {}));
//# sourceMappingURL=webntp.js.map