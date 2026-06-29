class CommunityComment {
  constructor(data = {}) {
    this.id = data.id;

    this.post_id = data.post_id;

    this.user_id = data.user_id;

    this.comment = data.comment || "";

    this.created_at =
      data.created_at || new Date();

    this.updated_at =
      data.updated_at || new Date();
  }

  static fromRow(row) {
    return new CommunityComment(row);
  }

  toJSON() {
    return {
      id: this.id,

      post_id: this.post_id,

      user_id: this.user_id,

      comment: this.comment,

      created_at: this.created_at,

      updated_at: this.updated_at,
    };
  }
}

module.exports = CommunityComment;