process.bin = process.title = 'marathon-deployer';

const commands = ['build', 'push', 'deploy', 'version', 'help'];


const pkg = require(process.cwd() + '/package.json');
