import { Message } from './message.model';

export class Channel {
  constructor(public name: string, public messages: Message[]) {}
}
