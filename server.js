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
const communityRoutes =
require('./routes/communities/communityRoutes');

const communityRuleRoutes =
require('./routes/communities/communityRuleRoutes');
const communityInvitationRoutes =
require('./routes/communities/communityInvitationRoutes');


const communityPostRoutes =
require('./routes/communities/communityPostRoutes');
const communityFileRoutes =
require('./routes/communities/communityFileRoutes');
const communityMemberRoutes =
require('./routes/communities/communityMemberRoutes');
const businessRoutes =
require('./routes/businesses/businessRoutes');

const channelRoutes =
require('./routes/channels/channels');

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

const createChannelsTable =
require('./models/channels/createChannelsTable');
const createChannelFollowersTable =
require('./models/channels/createChannelFollowersTable');

const createChannelPostsTable =
require('./models/channels/createChannelPostsTable');
const createChannelCommentsTable =
require('./models/channels/createChannelCommentsTable');
const createChannelLikesTable =
require('./models/channels/createChannelLikesTable');
const createChannelFilesTable =
require('./models/channels/createChannelFilesTable');

const channelPostRoutes =
require('./routes/channels/channelPosts');
const addBusinessCreatorColumns =
require('./database/migrations/addBusinessCreatorColumns');

const channelFileRoutes =
require('./routes/channels/channelFiles');

const profileRoutes =
require('./routes/profile/profileRoutes');
const onlineStatusRoute =
require('./routes/users/updateOnlineStatusRoute');
const trendingRoutes =
require('./routes/trending/trendingRoutes');
const creatorRoutes =
require('./routes/creators/creatorRoutes');

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

app.use('/api/channel-posts', channelPostRoutes);
app.use('/api/channel-files', channelFileRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/community-posts', communityPostRoutes);
app.use('/api/community-files', communityFileRoutes);
app.use('/api/community-rules', communityRuleRoutes);
app.use('/api/community-members', communityMemberRoutes);
app.use('/api/community-invitations', communityInvitationRoutes);

const createCommunitiesTable =
require('./models/communities/tables/createCommunitiesTable');
const createCommunityMembersTable =
require('./models/communities/tables/createCommunityMembersTable');
const createCommunityPostsTable =
require('./models/communities/tables/createCommunityPostsTable');
const createCommunityCommentsTable =
require('./models/communities/tables/createCommunityCommentsTable');
const createCommunityLikesTable =
require('./models/communities/tables/createCommunityLikesTable');
const createCommunityFilesTable =
require('./models/communities/tables/createCommunityFilesTable');
const createCommunityRulesTable =
require('./models/communities/tables/createCommunityRulesTable');
const createCommunityInvitationsTable =
require('./models/communities/tables/createCommunityInvitationsTable');
const createCommunityJoinRequestsTable =
require('./models/communities/tables/createCommunityJoinRequestsTable');

require('./controllers/businesses/enableBusinessModeController');
require('./controllers/businesses/disableBusinessModeController');
require('./controllers/businesses/updateBusinessProfileController');
require('./controllers/businesses/getBusinessesController');
require('./controllers/businesses/getBusinessProfileController');


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
app.use(
  '/api/channels',
  channelRoutes,
);
app.use(
  '/api/communities',
  communityRoutes,
);

app.use(
  '/api/community-posts',
  communityPostRoutes,
);

app.use(
  '/api/community-files',
  communityFileRoutes,
);

app.use(
  '/api/community-rules',
  communityRuleRoutes,
);

app.use(
  '/api/community-members',
  communityMemberRoutes,
);

app.use(
  '/api/community-invitations',
  communityInvitationRoutes,
);
app.use(
  '/api/business',
  businessRoutes,
);
app.use(
  '/api/trending',
  trendingRoutes,
);
app.use(
  '/api/creators',
  creatorRoutes,
);

app.get('/', (req, res) => {
  res.json({
    message: 'Swala Backend Running'
  });
});

async function initializeDatabase() {

  await createUsersTable();
  await addBusinessCreatorColumns();
  await createChatsTable();
  await createMessagesTable();

  await createGroupsTable();
  await createGroupMembersTable();
  await createGroupMessagesTable();
  await createGroupCallsTable();
  await createGroupFilesTable();

  await createPostsTable();
  await createCommentsTable();
  await createLikesTable();

  await createChannelFollowersTable();
  await createChannelsTable();
  await createChannelPostsTable();
  await createChannelCommentsTable();
  await createChannelLikesTable();
  await createChannelFilesTable();

  await createCommunitiesTable();
  await createCommunityMembersTable();
  await createCommunityPostsTable();
  await createCommunityCommentsTable();
  await createCommunityLikesTable();
  await createCommunityFilesTable();
  await createCommunityRulesTable();
  await createCommunityInvitationsTable();
  await createCommunityJoinRequestsTable();

  console.log("✅ Database initialized successfully.");

}

initializeDatabase();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});