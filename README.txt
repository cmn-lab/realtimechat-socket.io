That’s all it takes to load the socket.io-client, which exposes an io global (and the endpoint GET /socket.io/socket.io.js), and then connect.

If you would like to use the local version of the client-side JS file, you can find it at node_modules/socket.io/client-dist/socket.io.js.

Notice that I’m not specifying any URL when I call io(), since it defaults to trying to connect to the host that serves the page.