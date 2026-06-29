class CommunityRule {
  constructor(data = {}) {
    this.id = data.id;

    this.community_id = data.community_id;

    this.title = data.title || "";

    this.description = data.description || "";

    this.position = data.position || 0;

    this.created_at =
      data.created_at || new Date();

    this.updated_at =
      data.updated_at || new Date();
  }

  static fromRow(row) {
    return new CommunityRule(row);
  }

  toJSON() {
    return {
      id: this.id,

      community_id: this.community_id,

      title: this.title,

      description: this.description,

      position: this.position,

      created_at: this.created_at,

      updated_at: this.updated_at,
    };
  }
}

module.exports = CommunityRule;