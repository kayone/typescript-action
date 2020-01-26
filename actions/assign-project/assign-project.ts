import * as core from '@actions/core'
import * as github from '@actions/github'
import { addIssueToColumn } from '../github';

async function run(): Promise<void> {
  await addIssueToColumn(github.context.issue.number, core.getInput('column'));
}

run().catch(e => {
  core.setFailed(e);
});
