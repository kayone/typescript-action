import * as core from '@actions/core'
import * as github from '@actions/github'
const token = core.getInput('repo-token');
const context = github.context;

const gh = new github.GitHub(token);

export async function getRepo() {
    const repo = await gh.repos.get(context.repo);
    console.log('Repo:', repo);
    return repo.data;
}

export async function getProject(name: string = core.getInput('project')) {
    const projects = await gh.projects.listForRepo(context.repo);
    const projectInfo = projects.data.find(p => p.name == name);

    if (!projectInfo) throw new Error(`Project ${name} was not found in ${context.repo}`);

    console.log('Project:', projectInfo);

    return projectInfo;
}

export async function getProjectColumn(name: string) {
    const project = await getProject();
    const columns = await gh.projects.listColumns({ project_id: project.id });
    const col = columns.data.find(c => c.name == name);

    if (!col) throw new Error(`Column ${name} was not found in  ${project.name} ${context.repo}`);

    console.log('Col:', col);
    return col;
}


export async function addIssueToColumn(issueNumber: number, columnName: string) {
    const col = await getProjectColumn(columnName);
    return await gh.projects.createCard({ column_id: col.id, content_id: issueNumber, content_type: 'Issue' })
}
