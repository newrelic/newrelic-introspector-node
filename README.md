[![Community Project header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Community_Project.png)](https://opensource.newrelic.com/oss-category/#community-project)

# newrelic-introspector-node

This is a CLI tool for discovering instrumentable Node.js applications on a system,
retrieving contextual information about them, and automating the install of the New Relic Node agent.

Currently the instrument command only discovers and instruments processes hosted with the [PM2](https://pm2.keymetrics.io/) process manager.  Support for other process managers will be explored in the future.

## Getting Started

```
> npm install

> node src/index.js list
[ 12345 ]

> node src/index.js introspect --pid 12345
{
  pid: 12345,
  pm_id: 0,
  name: 'server',
  pm_exec_path: '/Users/myuser/node-app/src/server.js',
  pm_cwd: '/Users/myuser/node-app'
}

> node src/index.js instrument --pid 12345 --licenseKey $NEW_RELIC_LICENSE_KEY --appName "My Node Application"
...
Process instrumented successfully

```

## Instrumenting processes

The `instrument` command automates several installation steps:

1. Executes `npm install newrelic --save` in the working directory of the running application, as provided by PM2.
1. Sets the `NEW_RELIC_APP_NAME` and `NEW_RELIC_LICENSE_KEY` environment variables.
1. Restarts the application using PM2's [`restart` command](https://pm2.keymetrics.io/docs/usage/pm2-api/), adding `-r newrelic` to the interpreter args and injecting the newly set environment variables with the `--update-env` flag.

Instrumentation will survive further restarts with PM2, but may be lost if the application is redeployed or any other actions are taken that revert the changes above.

## Support

New Relic hosts and moderates an online forum where customers can interact with New Relic employees as well as other customers to get help and share best practices. Like all official New Relic open source projects, there's a related Community topic in the New Relic Explorers Hub. You can find this project's topic/threads here:

https://discuss.newrelic.com/tags/nodeagent

## Contribute

We encourage your contributions to improve newrelic-introspector-node! Keep in mind that when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.

If you have any questions, or to execute our corporate CLA (which is required if your contribution is on behalf of a company), drop us an email at opensource@newrelic.com.

**A note about vulnerabilities**

As noted in our [security policy](../../security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.

If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

If you would like to contribute to this project, review [these guidelines](./CONTRIBUTING.md).

## License

newrelic-introspector-node is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.

> [The newrelic-introspector-node also uses source code from third-party libraries. You can find full details on which libraries are used and the terms under which they are licensed in the third-party notices document.]
