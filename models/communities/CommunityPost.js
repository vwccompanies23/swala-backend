class CommunityPost {
  constructor(data = {}) {
    this.id = data.id;

    this.community_id = data.community_id;

    this.author_id = data.author_id;

    this.content = data.content || "";

    this.media_url =
        data.media_url || null;

    this.media_type =
        data.media_type || null;

    this.likes_count =
        data.likes_count || 0;

    this.comments_count =
        data.comments_count || 0;

    this.shares_count =
        data.shares_count || 0;

    this.created_at =
        data.created_at || new Date();

    this.updated_at =
        data.updated_at || new Date();
  }

  static fromRow(row) {
    return new CommunityPost(row);
  }

  toJSON() {
    return {
      id: this.id,

      community_id: this.community_id,

      author_id: this.author_id,

      content: this.content,

      media_url: this.media_url,

      media_type: this.media_type,

      likes_count: this.likes_count,

      comments_count: this.comments_count,

      shares_count: this.shares_count,

      created_at: this.created_at,

      updated_at: this.updated_at,
    };
  }
}

module.exports = CommunityPost;