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

		const files = (await fs.promises.readdir(process.cwd())).filter(function(file) {
			return fs.statSync(file).isFile() && /.*\.alf$/.test(file);
		})

		core.info(`cwd: ${process.cwd()}`)
		for (const file of files) {
			core.info(`alf file: ${file}`)
		}

		core.setOutput('alf-file', files[0])
	} catch (ex: any) {
		core.setFailed(ex.message)
	}
}

Run()
