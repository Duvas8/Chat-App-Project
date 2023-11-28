const PrivetConverstion = require('../models/privetConverstionModel')

const getAllPrivetConverstion = async() => {
    const users = await PrivetConverstion.find();
    return users
}

const createPrivetConverstion = async (obj) => {
  try {
    console.log( obj);
    // Create a new PrivetConverstion using the obj array for the members field
    const newPrivetConverstion = new PrivetConverstion({
      members: obj.members.map(member => ({ _id: member._id, memberName: member.memberName })),
      // Map the obj array to match the structure expected in the schema
      });
    console.log(newPrivetConverstion);
    // Save the new PrivetConverstion to the database
    await newPrivetConverstion.save();
    // Return the newPrivetConverstion and a success message
    return { newPrivetConverstion, message: 'New conversation was added' };
  } catch (error) {
    console.error('Error creating private conversation:', error);
    throw error;
  }
};


const addMessageToPrivetConverstion = async (converstionId, obj) => {
  try {
    console.log(converstionId, "teeessst");
    // Find the group by its ID
    const privetConverstion = await PrivetConverstion.findById(converstionId);
    if (!privetConverstion) {
      return "privetConverstion not found";
    }
    const newMessages = obj;
    // Append the new messages to the group's messages array
    privetConverstion.messages.push(...newMessages);
    // Save the updated group back to the database
    await privetConverstion.save();
    return "Messages saved";
  } catch (error) {
    console.log(error);
    return "Error saving messages";
  }
};

  

module.exports = {
    createPrivetConverstion,
    getAllPrivetConverstion,
    addMessageToPrivetConverstion
}