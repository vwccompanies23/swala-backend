class CommunityFile {
  constructor(data = {}) {
    this.id = data.id;

    this.post_id = data.post_id;

    this.uploaded_by = data.uploaded_by;

    this.file_name = data.file_name;

    this.file_url = data.file_url;

    this.file_type = data.file_type;

    this.file_size = data.file_size;

    this.created_at =
      data.created_at || new Date();
  }

  static fromRow(row) {
    return new CommunityFile(row);
  }

  toJSON() {
    return {
      id: this.id,

      post_id: this.post_id,

      uploaded_by: this.uploaded_by,

      file_name: this.file_name,

      file_url: this.file_url,

      file_type: this.file_type,

      file_size: this.file_size,

      created_at: this.created_at,
    };
  }
}

module.exports = CommunityFile;