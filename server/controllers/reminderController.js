import Reminder from "../models/Reminder.js";

// Create a new reminder
export const createReminder = async (req, res) => {
  try {
    const { title, remindAt } = req.body;
    if (!title || !remindAt) return res.status(400).json({ message: "Missing fields" });

    const reminder = await Reminder.create({
      userId: req.user._id,
      title,
      remindAt: new Date(remindAt),
    });

    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: "Failed to create reminder" });
  }
};

// Get all active (due and unread) notifications
export const getActiveNotifications = async (req, res) => {
  try {
    const now = new Date();
    // Find reminders for this user that are past their trigger time and haven't been read
    const notifications = await Reminder.find({
      userId: req.user._id,
      isRead: false,
      remindAt: { $lte: now } // $lte means "Less than or equal to" (Time has passed)
    }).sort({ remindAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// Mark a notification as read (dismiss it)
export const markAsRead = async (req, res) => {
  try {
    await Reminder.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ message: "Notification dismissed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to dismiss notification" });
  }
};