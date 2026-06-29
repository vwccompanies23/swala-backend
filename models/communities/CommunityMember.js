class CommunityMember {
  constructor(data = {}) {
    this.id = data.id;

    this.community_id = data.community_id;

    this.user_id = data.user_id;

    this.role = data.role || "member";

    this.status = data.status || "active";

    this.joined_at =
        data.joined_at || new Date();

    this.created_at =
        data.created_at || new Date();

    this.updated_at =
        data.updated_at || new Date();
  }

  static fromRow(row) {
    return new CommunityMember(row);
  }

  toJSON() {
    return {
      id: this.id,

      community_id: this.community_id,

      user_id: this.user_id,

      role: this.role,

      status: this.status,

      joined_at: this.joined_at,

      created_at: this.created_at,

      updated_at: this.updated_at,
    };
  }
}

module.exports = CommunityMember;