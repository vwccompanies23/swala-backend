class CommunityJoinRequest {
  constructor(data = {}) {
    this.id = data.id;

    this.community_id = data.community_id;

    this.user_id = data.user_id;

    this.status = data.status || "pending";

    this.created_at =
      data.created_at || new Date();

    this.updated_at =
      data.updated_at || new Date();
  }

  static fromRow(row) {
    return new CommunityJoinRequest(row);
  }

  toJSON() {
    return {
      id: this.id,

      community_id: this.community_id,

      user_id: this.user_id,

      status: this.status,

      created_at: this.created_at,

      updated_at: this.updated_at,
    };
  }
}

module.exports = CommunityJoinRequest;