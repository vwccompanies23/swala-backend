const express = require('express');

const router = express.Router();

const createGroup =
require('../../controllers/groups/createGroupController');

const getGroups =
require('../../controllers/groups/getGroupsController');

const addGroupMember =
require('../../controllers/groups/addGroupMemberController');

const removeGroupMember =
require('../../controllers/groups/removeGroupMemberController');

const sendGroupMessage =
require('../../controllers/groups/sendGroupMessageController');

const getGroupMessages =
require('../../controllers/groups/getGroupMessagesController');

const getGroupMembers =
require('../../controllers/groups/getGroupMembersController');

const updateGroup =
require('../../controllers/groups/updateGroupController');

const deleteGroup =
require('../../controllers/groups/deleteGroupController');

const leaveGroup =
require('../../controllers/groups/leaveGroupController');

const makeAdmin =
require('../../controllers/groups/makeAdminController');

const removeAdmin =
require('../../controllers/groups/removeAdminController');

const startGroupCall =
require('../../controllers/groups/startGroupCallController');

const endGroupCall =
require('../../controllers/groups/endGroupCallController');

const uploadGroupImage =
require('../../controllers/groups/uploadGroupImageController');

const uploadGroupVideo =
require('../../controllers/groups/uploadGroupVideoController');

const uploadGroupVoice =
require('../../controllers/groups/uploadGroupVoiceController');

const uploadGroupFile =
require('../../controllers/groups/uploadGroupFileController');
const getGroupAdmins =
require('../../controllers/groups/getGroupAdminsController');

router.post(
  '/create',
  createGroup,
);

router.get(
  '/',
  getGroups,
);

router.put(
  '/update',
  updateGroup,
);

router.delete(
  '/delete/:group_id',
  deleteGroup,
);

router.post(
  '/add-member',
  addGroupMember,
);

router.post(
  '/remove-member',
  removeGroupMember,
);

router.post(
  '/leave',
  leaveGroup,
);

router.get(
  '/members/:group_id',
  getGroupMembers,
);

router.post(
  '/make-admin',
  makeAdmin,
);

router.post(
  '/remove-admin',
  removeAdmin,
);

router.post(
  '/send-message',
  sendGroupMessage,
);

router.get(
  '/messages/:group_id',
  getGroupMessages,
);

router.post(
  '/upload-image',
  uploadGroupImage,
);

router.post(
  '/upload-video',
  uploadGroupVideo,
);

router.post(
  '/upload-voice',
  uploadGroupVoice,
);

router.post(
  '/upload-file',
  uploadGroupFile,
);

router.post(
  '/start-call',
  startGroupCall,
);

router.post(
  '/end-call',
  endGroupCall,
);
router.get(
  '/admins/:group_id',
  getGroupAdmins,
);

module.exports = router;