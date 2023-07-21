import http from 'node:http';
import handler from 'serve-handler';
http.createServer((request, response) => handler(request, response, {
    rewrites: [{
        source: '/',
        destination: './examples/web/index.html'
    }],
    headers: [{
        source: '**/*',
        headers: [
            { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
            { key: "Cross-Origin-Embedder-Policy", value: "require-corp" }
        ]
    }]
})).listen(3000, () => {
    console.log('Running at http://localhost:3000');
})
