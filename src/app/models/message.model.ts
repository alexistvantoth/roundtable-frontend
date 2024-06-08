export class Message {
  constructor(
    public sender: string,
    public recipient: string,
    public content: string,
    public isPrivate: boolean
  ) {}
}
