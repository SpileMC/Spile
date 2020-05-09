import { Server } from "net";

import { masterLog } from "@lib/mediator";

import BaseServer from "./BaseServer";

abstract class SimpleServer<S extends Server> implements BaseServer {
  public listening = false;

  protected log = masterLog.child(this.name);

  // Message to use when the log messages refer to itself (grammar and formatting purposes mostly).
  private displayName: string;

  // The internal server instance.
  public abstract server: S;

  public constructor(protected name: string, protected port: number) {
    this.displayName = name === "server" ? " " : ` ${name} `;
  }

  // Listens on the desired port and hostname.
  protected _listen(hostname?: string) {
    return new Promise((resolve, reject) => {
      const errorCb = (err: Error) => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        this.server.off("listening", listenCb);
        reject(err);
      };

      const listenCb = () => {
        this.server.off("error", errorCb);
        this.server.on("error", err => {
          this.log.error(`An error occurred in the${this.displayName}server!\n`, err);
        });

        resolve();
      };

      this.server.once("listening", listenCb);
      this.server.once("error", errorCb);

      this.server.listen(this.port, hostname);
    });
  }

  protected _close() {
    return new Promise((resolve, reject) => {
      this.server.close(err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  // An abstract function that when implemented MUST call this._listen.
  public abstract listen(): Promise<void>;

  // An abstract function that when implemented MUST call this._close.
  public abstract close(): Promise<void>;
}

export default SimpleServer;
