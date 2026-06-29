class CommunityLike {
  constructor(data = {}) {
    this.id = data.id;

    this.post_id = data.post_id;

    this.user_id = data.user_id;

    this.created_at =
      data.created_at || new Date();
  }

  static fromRow(row) {
    return new CommunityLike(row);
  }

  toJSON() {
    return {
      id: this.id,

      post_id: this.post_id,

      user_id: this.user_id,

      created_at: this.created_at,
    };
  }
}

module.exports = CommunityLike;