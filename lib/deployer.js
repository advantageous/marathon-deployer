#!/usr/bin/env node

function deploy(url, config, pkg) {

  const transport = require(url.startsWith('https') ? 'https' : 'http');
  const uri = require('url').parse(url);
  const basePath = uri.pathname;

  const listRequest = transport.get(Object.assign(uri, {path: basePath + 'v2/apps'}), (res) => {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      if (res.statusCode == 200) {
        body = JSON.parse(body);
        const found = body.apps.find(it => it.id === '/' + pkg.name);
        const payload = JSON
          .stringify(config)
          .replace(new RegExp('__NAME__', 'g'), pkg.name)
          .replace(new RegExp('__VERSION__', 'g'), pkg.version);
        const deployConfig = {headers: {'Content-Type': 'application/json', 'Content-Length': payload.length}};
        if (found) {
          deployConfig.path = basePath + 'v2/apps/' + pkg.name;
          deployConfig.method = 'PUT'
        } else {
          deployConfig.path = basePath + 'v2/apps/';
          deployConfig.method = 'POST'
        }
        const mergedConfig = Object.assign(uri, deployConfig);
        const deployRequest = transport.request(mergedConfig, (deployResponse) => {
          let body = '';
          deployResponse.setEncoding('utf8');
          deployResponse.on('data', (chunk) => body += chunk);
          deployResponse.on('end', () => {
            body = JSON.parse(body);
            console.log(JSON.stringify(body, null, 4));
            console.log('Complete.')
          })
        });
        deployRequest.on('error', (e) => {
          throw new Error(`problem with deploy request: ${e.message}`);
        });
        deployRequest.write(payload);
        deployRequest.end();
      } else {
        throw new Error(`Could not query ${uri} for apps. Failed with code: ${res.statusCode}`);
      }
    })
  });
  listRequest.on('error', (e) => {
    throw new Error(`problem with list request: ${e.message}`);
  });
}
