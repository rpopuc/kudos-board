class Panel {
  title: string
  slug: string
  owner: string
  createdAt: string

  constructor(data: any) {
    this.title = data?.title
    this.slug = data?.slug
    this.owner = data?.owner
    this.createdAt = data?.createdAt
  }
}

export default Panel
