const MentorActivity = require("../models/MentorActivity");
const Mentor = require("../models/Mentor");

const logMentorActivity = async (mentorId, action, meta = {}) => {
  // save activity
  await MentorActivity.create({
    mentorId,
    action,
    meta
  });

  // update last activity directly on mentor (for fast access)
  await Mentor.findByIdAndUpdate(mentorId, {
    lastActive: new Date(),
    lastActivityText: action
  });
};

module.exports = logMentorActivity;
