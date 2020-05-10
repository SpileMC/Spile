import { Predicate } from "@utils/typeUtils";

type CommandExecutor<C> = (ctx: C, msg: string, args: string[]) => Promise<string | void> | string | void;

export default interface Command<C> {
  name: string;
  namespace: string;
  inhibitors: Predicate<[C]>[];
  fn: CommandExecutor<C>;
}