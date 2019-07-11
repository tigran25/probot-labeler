import { Application, Context } from "probot";
import { ConfigManager } from "./config";
import { handle } from "./handler";
import { IConfig, schema } from "./models";

const configManager = new ConfigManager<IConfig>("labels.yml", {}, schema);

module.exports = async (app: Application) => {
  const events = [
    "issues",
    "pull_request",
    "pull_request_review",
    "pull_request_review_comment"
  ];

  app.on(events, async (context: Context) => {
    context.log("Grabbing Config");
    const config = await configManager.getConfig(context).catch(err => {
      context.log.error(err);
      return {} as IConfig;
    });
    if (config.issues || config.pulls) {
      context.log(
        `Handling issue: ${context.issue().number}, ${context.issue().owner} ${
          context.issue().repo
        }`
      );
      await handle(context, config).catch(err => {
        context.log.error(err);
      });
    }
  });

  app.on("*", async context => {
    context.log({ event: context.event, action: context.payload.action });
  });
};
