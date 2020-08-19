import { Context } from "probot";
import { IConfig } from "./models";

export async function handle(
  context: Context,
  config: IConfig
): Promise<void | Error> {
  const issueNumber = context.issue().number;
  const owner = context.issue().owner;
  const repo = context.issue().repo;
  const logger = context.log.child({
    owner: owner,
    repo: repo,
    issue: issueNumber,
    app: "probot-labler",
  });

  // don't run on actions performed by bots
  if (!context.isBot) {
    const currentAction: string = context.payload.action;
    const type = context.payload.issue ? "issue" : "pull_request";

    if (type === "issue" && config.issues) {
      const currentLabels: string[] = (context.payload.issue.labels as [
        { name: string }
      ]).map((x) => {
        return x.name;
      });

      for (const action in config.issues!) {
        if (action === currentAction) {
          if (config.issues[action].add) {
            const labelsToAdd = config.issues[action].add!.filter((x) => {
              return !currentLabels.includes(x);
            });
            await addLabels(context, labelsToAdd);
            logger.debug(`added labels: ${labelsToAdd}`);
          }
          if (config.issues[action].remove) {
            const labelsToRemove = config.issues[action].remove!.filter((x) => {
              return currentLabels.includes(x);
            });
            await removeLabels(context, labelsToRemove);
            logger.debug(`removed labels: ${labelsToRemove}`);
          }
        }
      }
    }
    if (type === "pull_request" && config.pulls) {
      const currentLabels: string[] = (context.payload.pull_request.labels as [
        { name: string }
      ]).map((x) => {
        return x.name;
      });
      for (const action in config.pulls!) {
        if (action === currentAction) {
          if (config.pulls[action].add) {
            const labelsToAdd = config.pulls[action].add!.filter((x) => {
              return !currentLabels.includes(x);
            });
            await addLabels(context, labelsToAdd);
            logger.debug(`added labels: ${labelsToAdd}`);
          }
          if (config.pulls[action].remove) {
            const labelsToRemove = config.pulls[action].remove!.filter((x) => {
              return currentLabels.includes(x);
            });
            await removeLabels(context, labelsToRemove);
            logger.debug(`removed labels: ${labelsToRemove}`);
          }
        }
      }
    }
  }
}

async function addLabels(context: Context, labels: string[]) {
  const issue = context.issue({ labels });
  await context.github.issues
    .addLabels({
      repo: issue.repo,
      owner: issue.owner,
      issue_number: issue.number,
      labels: issue.labels,
    })
    .catch((err) => {
      throw new Error(
        `Couldn't add labels to issue: ${context.issue().number}, ${err}`
      );
    });
}

async function removeLabels(context: Context, labels: string[]) {
  for (const label of labels) {
    const issue = context.issue({ name: label });
    await context.github.issues
      .removeLabel({
        repo: issue.repo,
        owner: issue.owner,
        issue_number: issue.number,
        name: issue.name,
      })
      .catch((err) => {
        throw new Error(
          `Couldn't add labels to issue: ${context.issue().number}, ${err}`
        );
      });
  }
}
