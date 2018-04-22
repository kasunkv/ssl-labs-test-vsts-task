import * as Task from 'vsts-task-lib';
import * as path from 'path';

Task.setResourcePath(path.join(__dirname, 'task.json'));

async function run(): Promise<string> {
    const promise = new Promise<string>(async (resolve, reject) => {
        try {
           

        } catch (err) {
            reject(err.message || err);
        }
    });

    return promise;
}

run()
    .then((res: string) => {
        console.log(res);
        Task.setResult(Task.TaskResult.Succeeded, res);
    })
    .catch((err: any) => {
        const msg = `Task Failed. Error: ${JSON.stringify(err)}`;
        console.log(msg);
        Task.setResult(Task.TaskResult.Failed, msg);
    });