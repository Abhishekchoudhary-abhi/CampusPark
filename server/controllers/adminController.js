/**
 * GET ALL ADMINS
 * ONLY OWNER CAN CALL THIS
 */
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'ADMIN' }).select(
      '_id name email active'
    );

    res.json(
      admins.map(a => ({
        id: a._id,
        name: a.name,
        email: a.email,
        enabled: a.active ?? true,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: 'Failed to load admins' });
  }
};

/**
 * ENABLE / DISABLE ADMIN
 * ONLY OWNER CAN CALL THIS
 */
export const toggleAdminStatus = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin || admin.role !== 'ADMIN') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.active = !admin.active;
    await admin.save();

    res.json({
      message: 'Admin status updated',
      enabled: admin.active,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update admin' });
  }
};
