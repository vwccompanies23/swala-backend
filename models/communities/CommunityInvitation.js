class CommunityInvitation {
  constructor(data = {}) {
    this.id = data.id;

    this.community_id = data.community_id;

    this.invited_by = data.invited_by;

    this.invited_user = data.invited_user;

    this.status = data.status || "pending";

    this.created_at =
      data.created_at || new Date();

    this.updated_at =
      data.updated_at || new Date();
  }

  static fromRow(row) {
    return new CommunityInvitation(row);
  }

  toJSON() {
    return {
      id: this.id,

      community_id: this.community_id,

      invited_by: this.invited_by,

      invited_user: this.invited_user,

      status: this.status,

      created_at: this.created_at,

      updated_at: this.updated_at,
    };
  }
}

module.exports = CommunityInvitation;