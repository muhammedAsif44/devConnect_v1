const mongoose = require("mongoose");
const Conversation = require("../model/conversationSchema");
const Message = require("../model/messageSchema");
const User = require("../model/userSchema");

exports.getOrCreateConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "Missing sender or receiver ID" });
    }

    const senderObjId = new mongoose.Types.ObjectId(senderId);
    const receiverObjId = new mongoose.Types.ObjectId(receiverId);

    // Get sender and receiver details
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    
    const isSenderPremium = sender?.isPremium || false;
    const isSenderMentor = sender?.role === "mentor";
    const isReceiverMentor = receiver?.role === "mentor";

    // Premium users can message anyone
    if (!isSenderPremium) {
      // Check if they are friends
      const isFriend = sender.friends?.includes(receiverId) && receiver.friends?.includes(senderId);
      
      if (!isFriend) {
        // If not friends, check for mentor-mentee session relationship
        const Session = require("../model/sessionSchema");
        
        // Check if there's a session between them (in either direction)
        const session = await Session.findOne({
          $or: [
            { mentorId: senderId, menteeId: receiverId },
            { mentorId: receiverId, menteeId: senderId }
          ],
          status: { $in: ["scheduled", "completed"] }
        });
        
        if (!session) {
          return res.status(403).json({ 
            message: "You need to be friends or have a booked session to start a conversation." 
          });
        }
      }
    }

    // 🔥 Critical Fix: normalize participants order
    const sortedIds = [senderObjId, receiverObjId].sort((a, b) =>
      a.toString().localeCompare(b.toString())
    );

    // ✅ Look for existing private chat with exactly these two participants
    let conversation = await Conversation.findOne({
      chatType: "private",
      participants: { $all: sortedIds },
    }).where("participants").size(2);

    if (!conversation) {
      console.log("⚠️ No conversation found, creating new one...");
      conversation = await Conversation.create({
        chatType: "private",
        participants: sortedIds,
      });
    } else {
      console.log("✅ Existing conversation found:", conversation._id);
    }

    return res.status(200).json({ conversation });
  } catch (error) {
    console.error("❌ Error creating/fetching conversation:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Create a group conversation
exports.createGroupConversation = async (req, res) => {
  try {
    const { adminId, participantIds, groupName, groupImage } = req.body;

    if (!adminId || !participantIds || !groupName)
      return res.status(400).json({ message: "Missing required group fields" });

    const conversation = await Conversation.create({
      chatType: "group",
      participants: [adminId, ...participantIds],
      admin: adminId,
      groupName,
      groupImage,
    });

    res.status(201).json({ success: true, conversation });
  } catch (error) {
    console.error("❌ Error creating group:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get all messages from a conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .populate("senderId", "name email profilePhoto")
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, text, mediaUrl } = req.body;
    console.log("Message payload:", req.body);

    if (!conversationId || !senderId)
      return res.status(400).json({ message: "Missing required fields" });

    const message = await Message.create({
      conversationId,
      senderId,
      text,
      mediaUrl,
    });

    // Update last message timestamp
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessageAt: new Date(),
    });

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get all conversations for a user
exports.getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId)
      return res.status(400).json({ message: "Missing userId" });

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email profilePhoto")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    console.error("❌ Error fetching user conversations:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};