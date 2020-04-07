import {IRenderable} from "./Render";

export default interface RenderableConsumer {
  consume(items: IRenderable[]): void
}