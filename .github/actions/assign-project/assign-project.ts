import * as core from '@actions/core'
import * as github from '@actions/github'
// import { wait } from './wait'

const token = core.getInput('repo-token');

async function run(): Promise<void> {
  try {

    const octokit = new github.GitHub(token);

    const repo = await octokit.repos.get({ owner: github.context.repo.owner, repo: github.context.repo.repo });
    const projects = await octokit.projects.listForRepo({ repo: repo.data.name, owner: github.context.repo.owner});

    const projectInfo = projects.data.find(p => p.name == 'Test Project');

    if (!projectInfo) {
      throw new Error('Couldnt find project');
    }


    const columns = await octokit.projects.listColumns({ project_id: projectInfo.id });

    console.log('found columns ', columns.data);
    const issue = github.context.issue;


    octokit.projects.createCard({column_id: columns.data.find(c=>c.name == 'Backlog')?.id!, content_id: issue.number, content_type: 'Issue'})

    const i = await octokit.issues.get({ issue_number: issue.number, owner: github.context.repo.owner, repo: github.context.repo.repo });


    // const ms: string = core.getInput('milliseconds')
    // core.debug(`Waiting ${ms} milliseconds ...`)

    // core.debug(new Date().toTimeString())
    // await wait(parseInt(ms, 10))
    // core.debug(new Date().toTimeString())

    // core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error)
  }
}

run()
