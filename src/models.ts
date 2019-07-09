import Joi = require("joi");

export interface IActionMap {
  [key: string]: { add?: string[], remove?: string[] };
}

export interface IConfig {
  issues?: IActionMap;
  pulls?: IActionMap;
}

const pullsActions = [
  "assigned",
  "unassigned",
  "labeled",
  "unlabeled",
  "opened",
  "edited",
  "closed",
  "reopened",
  "synchronize",
  "ready_for_review",
  "locked",
  "unlocked",
];

const issuesActions = [
  "opened",
  "edited",
  "deleted",
  "transferred",
  "pinned",
  "unpinned",
  "closed",
  "reopened",
  "assigned",
  "unassigned",
  "labeled",
  "unlabeled",
  "locked",
  "unlocked",
  "milestoned",
  "demilestoned",
];

const fields = {
  add: Joi.array()
    .description("Labels to add for this action"),
  remove: Joi.array()
    .description("Labels to remove for this action"),
};

function buildActionObject(actions: string[]) {
  const actionsMap: { [key: string]: Joi.ObjectSchema } = {};
  actions.forEach((action) => {
    actionsMap[action] = Joi.object().keys(fields);
  });
  return Joi.object().keys(actionsMap);
}

//
// issues:
//   opened:
//     add:
//       - triage/needs-triage
//   locked:
//     add:
//       - locked
export const schema = Joi.object().keys({
  issues: buildActionObject(issuesActions),
  pulls: buildActionObject(pullsActions),
});
