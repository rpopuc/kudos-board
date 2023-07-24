import { randomUUID } from "crypto";

export enum Status {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export type From = {
  name: string;
  id: string;
};

class Kudos {
  public panelSlug: string;
  public slug: string;
  public title: string;
  public description: string;
  public from: From;
  public to: string;
  public createdAt: Date;
  public status: string;

  constructor(data: any) {
    this.slug = data.slug ?? randomUUID();
    this.panelSlug = data.panelSlug;
    this.title = data.title;
    this.description = data.description;
    this.from = { name: data.from.name, id: data.from.id };
    this.to = data.to;
    this.createdAt = data.createdAt;
    this.status = data.status || Status.ACTIVE;
  }
}

export default Kudos;
