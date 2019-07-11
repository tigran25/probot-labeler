import { Context } from "probot";
import { IConfig } from "./models";

export async function handle(
  context: Context,
  config: IConfig
): Promise<void | Error> {
  // don't run on actions performed by bots
  if (!context.isBot) {
    const currentAction: string = context.payload.action;
    const type = context.payload.issue ? "issue" : "pull_request";

    if (type === "issue" && config.issues) {
      const currentLabels: string[] = (context.payload.issue.labels as [
        { name: string }
      ]).map(x => {
        return x.name;
      });

      for (const action in config.issues!) {
        if (action === currentAction) {
          if (config.issues[action].add) {
            const labelsToAdd = config.issues[action].add!.filter(x => {
              return !currentLabels.includes(x);
            });
            await addLabels(context, labelsToAdd);
          }
          if (config.issues[action].remove) {
            const labelsToRemove = config.issues[action].remove!.filter(x => {
              return currentLabels.includes(x);
            });
            await removeLabels(context, labelsToRemove);
          }
        }
      }
    }
    if (type === "pull_request" && config.pulls) {
      const currentLabels: string[] = (context.payload.pull_request.labels as [
        { name: string }
      ]).map(x => {
        return x.name;
      });
      for (const action in config.pulls!) {
        if (action === currentAction) {
          if (config.pulls[action].add) {
            const labelsToAdd = config.pulls[action].add!.filter(x => {
              return !currentLabels.includes(x);
            });
            await addLabels(context, labelsToAdd);
          }
          if (config.pulls[action].remove) {
            const labelsToRemove = config.pulls[action].remove!.filter(x => {
              return currentLabels.includes(x);
            });
            await removeLabels(context, labelsToRemove);
          }
        }
      }
    }
  }
}

async function addLabels(context: Context, labels: string[]) {
  await context.github.issues
    .addLabels(context.issue({ labels }))
    .catch(err => {
      throw new Error(
        `Couldn't add labels to issue: ${context.issue().number}, ${err}`
      );
    });
}

async function removeLabels(context: Context, labels: string[]) {
  for (const label of labels) {
    await context.github.issues
      .removeLabel(context.issue({ name: label }))
      .catch(err => {
        throw new Error(
          `Couldn't add labels to issue: ${context.issue().number}, ${err}`
        );
      });
  }
}
