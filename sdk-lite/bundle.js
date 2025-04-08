Object.defineProperty(exports, "__esModule", { value: true });
exports.doQuery = doQuery;
// import type { FetchFunction } from 'relay-runtime';
// @ts-ignore
const environment_1 = require("./environment");
const relay_runtime_1 = require("relay-runtime");
// const fetchFn: FetchFunction = function (request, variables) {
//   return new Observable.create(source => {
//     fetch('/my-graphql-api', {
//       method: 'POST',
//       body: JSON.stringify({
//         text: request.text,
//         variables,
//       }),
//     })
//       .then(response => response.json())
//       .then(data => source.next(data));
//   });
// };
// const network = Network.create(fetchFn);
// const store = new Store(new RecordSource());
// const environment = new Environment({
//   network,
//   store,
// });
const environment = (0, environment_1.createEnvironment)({ endpoint: "https://registry.wasmer.wtf/graphql" });
async function doQuery() {
    let query = await (0, relay_runtime_1.fetchQuery)(environment, (0, relay_runtime_1.graphql) `
    query AppQuery {
      viewer {
        username
      }
    }
  `, {}).toPromise();
    console.log(query.data.viewer.username);
}
doQuery();
