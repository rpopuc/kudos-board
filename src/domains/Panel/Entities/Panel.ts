class Panel {
  public title: string;
  public slug: string;
  public owner: string;
  public createdAt: string;

  constructor(data: any) {
    this.slug = "_futuro_slug_aleatorio";
    this.title = data.title;
    this.owner = data.owner;
    this.createdAt = data.createdAt;
  }
}

export default Panel;
