const User = require('../models/userModel')
const Group = require('../models/groupModel')

const getAllGroups = async() => {
    const users = await Group.find();
    return users
}

const createGroup = async(obj) => {
    try {
        const newGroup = new Group(obj)
        await newGroup.save()
        
        const memberIds = newGroup.members.map((member) => member._id);
        console.log(memberIds);
        console.log(newGroup._id);

        // Update all users' groups array with the new groupId
        for (const memberId of memberIds) {
            await User.findByIdAndUpdate(
                memberId,
                { $push: { groups: { groupId: newGroup._id } } },
                {safe: true, upsert: true}
            );
        }
       
       
        return (newGroup , 'new group was added')
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    } 
}

const addMessageToGroup = async (groupId, obj) => {
  try {
    // Find the group by its ID
    const group = await Group.findById(groupId);

    if (!group) {
      return "Group not found";
    }

    // Assuming obj.messages is an array of new messages
    const newMessages = obj; // Use obj.messages, not obj itself

    // Append the new messages to the group's messages array
    group.messages.push(...newMessages);

    // Save the updated group back to the database
    await group.save();

    return "Messages saved";
  } catch (error) {
    console.log(error);
    return "Error saving messages";
  }
};

const addContactToGroup = async(groupId, obj) => {
  try {
    // Find the group by its ID
    const group = await Group.findById(groupId);
    console.log(group);
    if (!group) {
      return "Group not found";
    }
    const newMembers = obj.members; 
    // Append the new messages to the group's messages array
    group.members.push(...newMembers);
    // Save the updated group back to the database
    await group.save();
    return "Add new members";
  } catch (error) {
    console.log(error);
    return "Error Add new members";
  }
}

const removeUserFromGroup = async (groupId, obj) => {
  try {
    // Find the group by its ID
    console.log(groupId);
    const group = await Group.findById(groupId);
    console.log(group);
    if (!group) {
      return "Group not found";
    }

    group.members = obj;
console.log(group);
    // Save the updated group back to the database
    await group.save();
    return "Member removed";
  } catch (error) {
    console.log(error);
    return "Error Member removed";
  }
};
 

module.exports = {
    createGroup,
    getAllGroups,
    addMessageToGroup,
    addContactToGroup,
    removeUserFromGroup
}