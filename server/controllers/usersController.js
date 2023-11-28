const User = require('../models/userModel')

const getAllUsers = async() => {
    const users = await User.find();
    return users
}
const updateUser = async (id, obj) => {
    await User.findByIdAndUpdate(id, obj);
    return 'User Updated!';
  };
const addContact = async (id, obj) => {
    const users = await User.find();
    console.log("users",users)
    
    console.log(obj.phoneNumber);
    const machedPhoneNumber =  users.find((user) => user.phoneNumber == obj.phoneNumber)
    console.log(machedPhoneNumber)
    const newContact = {
        contactName: obj.contactName,
        phoneNumber: obj.phoneNumber,
        _id:machedPhoneNumber._id
    }
    const currentUser = await User.findById(id)
    currentUser.contacts.push(newContact)
    try {
    
    if(!machedPhoneNumber) return "there no users with this phone number"
    console.log(currentUser)
    await currentUser.save()
    return 'New Contsct Was Added'
    } catch (error) {
        console.log(error);
    } 
}

const getAllUsersContacts = async (id) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return []; // Return an empty array if the user is not found
      }
      return user || []; // Return the contacts array or an empty array if it doesn't exist
    } catch (error) {
      console.error('Error fetching user contacts:', error);
      return []; // Return an empty array in case of an error
    }
  };
  const blockContact = async(id, obj) => {
    try {
      await User.findByIdAndUpdate(id, { blockedContacts: obj.blockedContacts });
    return `Blocked contacts updated successfully`;
    } catch (error) {
      return error
    }
   
  } 
module.exports = {
    getAllUsers,
    updateUser,
    addContact,
    getAllUsersContacts,
    blockContact
}