import { handle } from "../handler";
import { IConfig } from "../models";
import { FakeContext } from "./fakecontext";
import { FakeGithub } from "./fakegithub";

it("performs a label addition from an action config", () => {
  expect.assertions(2);
  const github = new FakeGithub([]);
  const context = new FakeContext({ action: "opened", issue: { labels: []}}, github, {});
  const config: IConfig = { issues: { opened: { add : [ "triage" ] } } };
  return handle(context, config).then((resp) => {
    expect(github.labelsAdded).toEqual(["triage"]);
    expect(github.labelsRemoved).toEqual([]);
  });
});

it("performs multiple label additions from an action config", () => {
  expect.assertions(2);
  const github = new FakeGithub([]);
  const context = new FakeContext({ action: "opened", issue: { labels: []}}, github, {});
  const config: IConfig = { issues: { opened: { add : [ "triage", "test" ] } } };
  return handle(context, config).then((resp) => {
    expect(github.labelsAdded).toEqual(["triage", "test"]);
    expect(github.labelsRemoved).toEqual([]);
  });
});

it("doesn't perform a label addition when the label is already on the issue/PR", () => {
  expect.assertions(2);
  const github = new FakeGithub([]);
  const context = new FakeContext({ action: "opened", issue: { labels: []}}, github, {});
  const config: IConfig = { issues: { opened: { add : [ "triage" ] } } };
  return handle(context, config).then((resp) => {
    expect(github.labelsAdded).toEqual(["triage"]);
    expect(github.labelsRemoved).toEqual([]);
  });
});

it("performs a label removal from an action config", () => {
  expect.assertions(2);
  const github = new FakeGithub([]);
  const context = new FakeContext({ action: "opened", issue: { labels: [{ name: "triage" }]}}, github, {});
  const config: IConfig = { issues: { opened: { remove : [ "triage" ] } } };
  return handle(context, config).then((resp) => {
    expect(github.labelsRemoved).toEqual(["triage"]);
    expect(github.labelsAdded).toEqual([]);
  });
});

it("performs multiple label removals from an action config", () => {
  expect.assertions(2);
  const github = new FakeGithub([]);
  const context = new FakeContext({
    action: "opened",
    issue: { labels: [
      { name: "triage" },
      { name: "test" },
    ]},
  }, github, {});
  const config: IConfig = { issues: { opened: { remove : [ "triage", "test" ] } } };
  return handle(context, config).then((resp) => {
    expect(github.labelsRemoved).toEqual(["triage", "test"]);
    expect(github.labelsAdded).toEqual([]);
  });
});

it("doesn't perform a label removal when the label isn't present on the issue/PR", () => {
  expect.assertions(2);
  const github = new FakeGithub([]);
  const context = new FakeContext({ action: "opened", issue: { labels: []}}, github, {});
  const config: IConfig = { issues: { opened: { remove : [ "triage" ] } } };
  return handle(context, config).then((resp) => {
    expect(github.labelsRemoved).toEqual([]);
    expect(github.labelsAdded).toEqual([]);
  });
});
