import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as os from 'os'
import * as fs from 'fs'
import { Unity, UnityCommandBuilder } from '@akiojin/unity-command'

async function Run()
{
	try {
		const builder = new UnityCommandBuilder()
			.RequestActivaion()
	
		core.startGroup('Run Unity')
		await exec.exec(Unity.GetExecutePath(os.platform()), builder.Build())
		core.endGroup()

		fs.readdir(process.cwd(), function(err, files) {
			if (err) {
				throw err;
			}

			const fileList = files.filter(function(file) {
				return fs.statSync(file).isFile() && /.*\.alf$/.test(file);
			})

			core.setOutput('alf-file', fileList[0])
		});
	} catch (ex: any) {
		core.setFailed(ex.message)
	}
}

Run()
