class Community {
  constructor(data = {}) {
    this.id = data.id;

    this.owner_id = data.owner_id;

    this.name = data.name;

    this.username = data.username;

    this.description = data.description || "";

    this.profile_image =
        data.profile_image || null;

    this.cover_image =
        data.cover_image || null;

    this.category =
        data.category || "General";

    this.is_private =
        data.is_private || false;

    this.members_count =
        data.members_count || 0;

    this.posts_count =
        data.posts_count || 0;

    this.rules_count =
        data.rules_count || 0;

    this.created_at =
        data.created_at || new Date();

    this.updated_at =
        data.updated_at || new Date();
  }

  static fromRow(row) {
    return new Community(row);
  }

  toJSON() {
    return {
      id: this.id,

      owner_id: this.owner_id,

      name: this.name,

      username: this.username,

      description: this.description,

      profile_image: this.profile_image,

      cover_image: this.cover_image,

      category: this.category,

      is_private: this.is_private,

      members_count: this.members_count,

      posts_count: this.posts_count,

      rules_count: this.rules_count,

      created_at: this.created_at,

      updated_at: this.updated_at,
    };
  }
}

module.exports = Community;