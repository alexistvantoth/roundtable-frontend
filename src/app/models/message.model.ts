export class Message {
  constructor(
    public from: string,
    public to: string,
    public content: string,
    public timestamp?: Date,
    public isPrivate: boolean = false
  ) {}
}
