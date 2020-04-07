import { IRenderable } from "./renders/ItemRenderer";

export default interface RenderableConsumer {
  consume(items: IRenderable[]): void;
}
