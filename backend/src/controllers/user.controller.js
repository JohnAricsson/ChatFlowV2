import User from "../models/user.model.js";

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user._id;

    const users = await User.find({
      _id: { $ne: currentUserId },
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};

export const togglePinChat = async (req, res) => {
  try {
    const { id: targetUserId } = req.params;
    const myId = req.user._id;

    const user = await User.findById(myId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPinned = user.pinnedChats.includes(targetUserId);

    if (isPinned) {
      user.pinnedChats = user.pinnedChats.filter(
        (id) => id.toString() !== targetUserId,
      );
    } else {
      user.pinnedChats.push(targetUserId);
    }

    await user.save();

    res.status(200).json(user.pinnedChats);
  } catch (error) {
    console.error("Error in togglePinChat:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const hideChat = async (req, res) => {
  try {
    const { id: userIdToHide } = req.params;
    const myId = req.user._id;

    await User.findByIdAndUpdate(myId, {
      $addToSet: { hiddenChats: userIdToHide },
    });

    res.status(200).json({ message: "Chat hidden successfully" });
  } catch (error) {
    console.log("Error in hideChat controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
