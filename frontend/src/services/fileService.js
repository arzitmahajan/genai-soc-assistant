import api from "../api/axios";
 const fetchUserFiles = async (user_id)=>{
    const response = await api.get(`/files/list?user_id=${user_id}`);
    return response.data.files;
 }
 const deleteUserFile = async(user_id,filename)=>{
    const response = await api.delete(`/files/delete_file?user_id=${user_id}&filename=${filename}`);
    return response.data;
 }
 export default { fetchUserFiles, deleteUserFile };
