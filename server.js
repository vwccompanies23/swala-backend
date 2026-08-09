const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');
require("./firebase/firebaseAdmin");

const path = require("path");
const http = require('http');

const { Server } = require("socket.io");


const createUsersTable = require('./models/users/userModel');
const createChatsTable = require('./models/chats/chatModel');
const createMessagesTable = require('./models/messages/messageModel');
const createPostsTable = require('./models/posts/postModel');
const createCommentsTable =
require('./models/comments/createCommentsTable');
const createLikesTable =
require('./models/likes/createLikesTable');

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

const createCallsTable =
require('./models/calls/createCallsTable');
const createCallSignalsTable =
require('./models/calls/createCallSignalsTable');
const createCallParticipantsTable =
require('./models/calls/createCallParticipantsTable');
const createCallHistoryTable =
require('./models/calls/createCallHistoryTable');

const createMediaMessagesTable =
require("./models/messages/createMediaMessagesTable");
const createContactsTable =
require("./models/contacts/createContactsTable");
const createStatusesTable =
require("./models/status/createStatusesTable");
const createStatusViewsTable =
require("./models/status/createStatusViewsTable");
const createStatusPrivacyTable =
require("./models/status/createStatusPrivacyTable");

const channelPostRoutes =
require('./routes/channels/channelPosts');
const addBusinessCreatorColumns =
require('./database/migrations/addBusinessCreatorColumns');

const channelFileRoutes =
require('./routes/channels/channelFiles');
const {
    startStatusScheduler,
} = require("./services/status/statusScheduler");
const {
    startPostScheduler,
} = require("./services/posts/postScheduler");

const profileRoutes =
require('./routes/profile/profileRoutes');
const onlineStatusRoute =
require('./routes/users/updateOnlineStatusRoute');
const trendingRoutes =
require('./routes/trending/trendingRoutes');
const creatorRoutes =
require('./routes/creators/creatorRoutes');

const callRoutes =
require('./routes/calls/callRoutes');
const broadcastRoutes =
require('./routes/broadcasts/broadcastRoutes');
const uploadRoutes =
require('./routes/uploads/upload.routes');
const contactRoutes =
require("./routes/contacts/contactRoutes");

const mediaRoutes =
require("./routes/media/mediaRoutes");
const statusRoutes =
require("./routes/status/statusRoutes");
const shareRoutes =
require("./routes/shares/shareRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/likes', likeRoutes);

app.use('/api/channel-posts', channelPostRoutes);
app.use('/api/channel-files', channelFileRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/community-posts', communityPostRoutes);
app.use('/api/community-files', communityFileRoutes);
app.use('/api/community-rules', communityRuleRoutes);
app.use('/api/community-members', communityMemberRoutes);
app.use('/api/community-invitations', communityInvitationRoutes);

app.use(

require("./middleware/rateLimiter"),

);

app.use(

    "/uploads",

    express.static(

        path.join(

            __dirname,

            "uploads",

        ),

    ),

);

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

const createBroadcastsTable =
require('./models/broadcasts/createBroadcastsTable');
const createBroadcastMembersTable =
require('./models/broadcasts/createBroadcastMembersTable');
const createBroadcastMessagesTable =
require('./models/broadcasts/createBroadcastMessagesTable');
const createBroadcastMediaTable =
require('./models/broadcasts/createBroadcastMediaTable');
const createBroadcastFilesTable =
require('./models/broadcasts/createBroadcastFilesTable');
const createBroadcastLinksTable =
require('./models/broadcasts/createBroadcastLinksTable');
const createBroadcastNotificationSettingsTable =
require('./models/broadcasts/createBroadcastNotificationSettingsTable');
const createBroadcastWallpaperTable =
require('./models/broadcasts/createBroadcastWallpaperTable');
const createBroadcastReadsTable =
require('./models/broadcasts/createBroadcastReadsTable');
const createBroadcastReactionsTable =
require('./models/broadcasts/createBroadcastReactionsTable');

const createPostViewsTable =
require("./models/posts/createPostViewsTable");
const createSharesTable = require("./models/shares/createSharesTable");

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
app.use(
  '/api/calls',
  callRoutes,
);
app.use(
  '/api/broadcast',
  broadcastRoutes,
);
app.use(
  '/api/upload',
  uploadRoutes,
);

app.use(
    "/api/status",
    statusRoutes,
);

app.use(
    "/api/contacts",
    contactRoutes,
);
app.use(

    "/api/media",

    mediaRoutes,

);

app.use(

    "/api/shares",

    shareRoutes,

);


app.get('/', (req, res) => {
  res.json({
    message: 'Swala Backend Running'
  });
});

async function runMigrationWithRetry(name, migrationFn, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (typeof migrationFn === 'function') {
        await migrationFn();
        // Give the remote database socket a safe 50ms breather between statements
        await new Promise(resolve => setTimeout(resolve, 50));
        return;
      }
    } catch (error) {
      console.warn(`⚠️ [Attempt ${attempt}/${retries}] Failed migration for ${name}: ${error.message}`);
      if (attempt === retries) {
        console.error(`❌ Permanent Migration Failure on: ${name}`);
      } else {
        // Exponential back-off delay to let the socket recover
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
}

async function initializeDatabase() {
  console.log('🔄 Initializing database tables safely and sequentially...');

  const migrationSteps = [
    { name: 'Users Table', fn: createUsersTable },
    { name: 'Business Creator Migration', fn: addBusinessCreatorColumns },
    { name: 'Chats Table', fn: createChatsTable },
    { name: 'Messages Table', fn: createMessagesTable },
    { name: 'Groups Table', fn: createGroupsTable },
    { name: 'Group Members Table', fn: createGroupMembersTable },
    { name: 'Group Messages Table', fn: createGroupMessagesTable },
    { name: 'Group Calls Table', fn: createGroupCallsTable },
    { name: 'Group Files Table', fn: createGroupFilesTable },
    { name: 'Posts Table', fn: createPostsTable },
    { name: 'Comments Table', fn: createCommentsTable },
    { name: 'Likes Table', fn: createLikesTable },
    { name: 'Channels Table', fn: createChannelsTable },
    { name: 'Channel Followers Table', fn: createChannelFollowersTable },
    { name: 'Channel Posts Table', fn: createChannelPostsTable },
    { name: 'Channel Comments Table', fn: createChannelCommentsTable },
    { name: 'Channel Likes Table', fn: createChannelLikesTable },
    { name: 'Channel Files Table', fn: createChannelFilesTable },
    { name: 'Communities Table', fn: createCommunitiesTable },
    { name: 'Community Members Table', fn: createCommunityMembersTable },
    { name: 'Community Posts Table', fn: createCommunityPostsTable },
    { name: 'Community Comments Table', fn: createCommunityCommentsTable },
    { name: 'Community Likes Table', fn: createCommunityLikesTable },
    { name: 'Community Files Table', fn: createCommunityFilesTable },
    { name: 'Community Rules Table', fn: createCommunityRulesTable },
    { name: 'Community Invitations Table', fn: createCommunityInvitationsTable },
    { name: 'Community Join Requests Table', fn: createCommunityJoinRequestsTable },
    { name: 'Calls Table', fn: createCallsTable },
    { name: 'Call Signals Table', fn: createCallSignalsTable },
    { name: 'Call Participants Table', fn: createCallParticipantsTable },
    { name: 'Call History Table', fn: createCallHistoryTable },
    { name: 'Broadcasts Table', fn: createBroadcastsTable },
    { name: 'Broadcast Members Table', fn: createBroadcastMembersTable },
    { name: 'Broadcast Messages Table', fn: createBroadcastMessagesTable },
    { name: 'Broadcast Media Table', fn: createBroadcastMediaTable },
    { name: 'Broadcast Files Table', fn: createBroadcastFilesTable },
    { name: 'Broadcast Links Table', fn: createBroadcastLinksTable },
    { name: 'Broadcast Notification Settings', fn: createBroadcastNotificationSettingsTable },
    { name: 'Broadcast Wallpaper Table', fn: createBroadcastWallpaperTable },
    { name: 'Broadcast Reads Table', fn: createBroadcastReadsTable },
    { name: 'Broadcast Reactions Table', fn: createBroadcastReactionsTable },
    { name: 'Media Messages Table', fn: createMediaMessagesTable },
    { name: 'Contacts Table', fn: createContactsTable },
    { name: 'Statuses Table', fn: createStatusesTable },
    { name: 'Status Views Table', fn: createStatusViewsTable },
    { name: 'Status Privacy Table', fn: createStatusPrivacyTable },
    { name: 'Post Views Table', fn: createPostViewsTable },
    { name: 'Shares Table', fn: createSharesTable }
  ];

  for (const step of migrationSteps) {
    await runMigrationWithRetry(step.name, step.fn);
  }

  console.log("✅ Database initialized successfully.");
}

// Error middleware should be registered AFTER all routes
app.use(require("./middleware/errorMiddleware"));

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const realtimeService = require("./realtime/realtimeService");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

realtimeService.initialize(io);

// Start server first, then safely initialize database tables sequentially
console.log("SERVER FILE LOADED");

server.listen(PORT, async () => {
  console.log(`🚀 Swala Backend running on port ${PORT}`);
  console.log("STEP 1");

  try {
    console.log("STEP 2");
    await initializeDatabase();
    console.log("STEP 3");
  } catch (err) {
    console.error("DATABASE INIT FAILED:", err);
  }

  startStatusScheduler();
  startPostScheduler();
});