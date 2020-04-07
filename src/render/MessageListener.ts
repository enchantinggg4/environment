
import MessageConsumer from "./MessageConsumer";
import {FoodRenderable, TestPlayerRenderable} from "./env/renders";




export default abstract class MessageListener {
  abstract onMessageData(e: { items: any[] }): void;
}

export class WorkerMessageListener extends MessageListener {
  constructor(worker: Worker, consumer: MessageConsumer) {
    super();
    worker.addEventListener("message", (e: any) => {
      if (e.data.type === "items") {
        consumer.consume(
          e.data.items.map((it: any) => {
            if (it.type === "FOOD") {
              return new FoodRenderable(it);
            } else {
              return new TestPlayerRenderable(it);
            }
          })
        );
      }
    });
  }
  onMessageData(e: { items: any[] }) {}
}

export class WebsocketMessageListener extends MessageListener {
  constructor(socket: WebSocket, consumer: MessageConsumer) {
    super();

    socket.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "items") {
        consumer.consume(
          data.items.map((it: any) => {
            if (it.type === "FOOD") {
              return new FoodRenderable(it);
            } else {
              return new TestPlayerRenderable(it);
            }
          })
        );
      }
    });
  }
  onMessageData(e: { items: any[] }) {}
}