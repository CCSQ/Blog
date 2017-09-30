var chalk = require('chalk') // 控制台颜色
var semver = require('semver') // 版本检测工具
var packageConfig = require('../package.json')
var shell = require('shelljs') // shell命令包，可跨平台使用
	// 执行cmd命令
function exec(cmd) {
	return require('child_process').execSync(cmd).toString().trim()
}

var versionRequirements = [{
		name: 'node',
		currentVersion: semver.clean(process.version),
		versionRequirement: packageConfig.engines.node
	}]
	// 判断是否支持npm命令
if (shell.which('npm')) {
	versionRequirements.push({
		name: 'npm',
		currentVersion: exec('npm --version'),
		versionRequirement: packageConfig.engines.npm
	})
}

module.exports = function() {
	var warnings = []
	for (var i = 0; i < versionRequirements.length; i++) {
		var mod = versionRequirements[i]
		if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
			warnings.push(mod.name + ': ' +
				chalk.red(mod.currentVersion) + ' should be ' +
				chalk.green(mod.versionRequirement)
			)
		}
	}

	if (warnings.length) {
		console.log('')
		console.log(chalk.yellow('To use this template, you must update following to modules:'))
		console.log()
		for (var i = 0; i < warnings.length; i++) {
			var warning = warnings[i]
			console.log('  ' + warning)
		}
		console.log()
		process.exit(1)
	}
}