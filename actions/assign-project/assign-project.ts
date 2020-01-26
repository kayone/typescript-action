import * as core from '@actions/core'
import * as github from '@actions/github'
import { addIssueToColumn } from '../github';
// import { wait } from './wait'

async function run(): Promise<void> {
  try {
    await addIssueToColumn(github.context.issue.number, "Backlog");
  } catch (error) {
    core.setFailed(error)
  }
}

run()
