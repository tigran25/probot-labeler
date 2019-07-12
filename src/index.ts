import { Application, Context } from "probot";
import { ConfigManager } from "./config";
import { handle } from "./handler";
import { IConfig, schema } from "./models";

module.exports = async (app: Application) => {
  const events = [
    "issues",
    "pull_request",
    "pull_request_review",
    "pull_request_review_comment"
  ];
  const configManager = new ConfigManager<IConfig>("labels.yml", {}, schema);
  app.log.info("probot-labeler loaded");

  app.on(events, async (context: Context) => {
    const inumber = context.issue().number;
    const repo = context.issue().repo;
    const owner = context.issue().owner;

    const logger = context.log.child({
      owner: owner,
      repo: repo,
      issue: inumber,
      app: "probot-labler"
    });
    logger.debug("Getting Config");

    const config = await configManager.getConfig(context).catch(err => {
      context.log.error(err);
      return {} as IConfig;
    });
    if (config.issues || config.pulls) {
      logger.debug("Config exists");
      logger.debug(config);
      await handle(context, config).catch(err => {
        logger.error(err);
      });
      logger.debug("Handled");
    }
  });

  app.on("*", async context => {
    context.log({ event: context.event, action: context.payload.action });
  });
};
