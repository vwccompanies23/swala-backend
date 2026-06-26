const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');
require("./firebase/firebaseAdmin");

const createUsersTable = require('./models/users/userModel');
const createChatsTable = require('./models/chats/chatModel');
const createMessagesTable = require('./models/messages/messageModel');
const createPostsTable = require('./models/posts/postModel');
const createCommentsTable = require('./models/comments/commentModel');
const createLikesTable = require('./models/likes/likeModel');

const messageRoutes = require('./routes/messages/messageRoutes');
const postRoutes = require('./routes/posts/postRoutes');
const commentRoutes = require('./routes/comments/commentRoutes');
const likeRoutes = require('./routes/likes/likeRoutes');

const authRoutes = require('./routes/auths/authRoutes');
const userRoutes = require('./routes/users/userRoutes');
const chatRoutes = require('./routes/chats/chatRoutes');

const createGroupsTable =
require('./models/groups/createGroupsTable');

const createGroupMembersTable =
require('./models/groups/createGroupMembersTable');

const createGroupMessagesTable =
require('./models/groups/createGroupMessagesTable');
const groupRoutes =
require('./routes/groups/groupRoutes');
const createGroupCallsTable =
require('./models/groups/createGroupCallsTable');
const createGroupFilesTable =
require('./models/groups/createGroupFilesTable');

const profileRoutes =
require('./routes/profile/profileRoutes');
const onlineStatusRoute =
require('./routes/users/updateOnlineStatusRoute');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use(
  '/api/groups',
  groupRoutes,
);

app.use(
  '/uploads',
  express.static('uploads'),
);

app.use(
  '/api/profile',
  profileRoutes,
);
app.use(
  '/api/users',
  onlineStatusRoute,
);

app.get('/', (req, res) => {
  res.json({
    message: 'Swala Backend Running'
  });
});

createUsersTable();

createChatsTable();
createMessagesTable();

createGroupsTable();
createGroupMembersTable();
createGroupMessagesTable();

createPostsTable();
createCommentsTable();
createLikesTable();
createGroupCallsTable();
createGroupFilesTable();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});