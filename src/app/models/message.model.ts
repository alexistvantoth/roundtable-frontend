export class Message {
  constructor(
    public from: string,
    public to: string,
    public content: string,
    public timestamp: Date = new Date(),
    public isPrivate: boolean = false
  ) {}
}
