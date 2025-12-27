import api from '../api/axios';

const uploadFile = async (file,user_id) => {
    const form = new FormData();
    form.append('file', file);
    form.append("user_id",user_id); // for check



    // Example: use server upload endpoint that validates file type/size and scans it.
    const resp = await api.post('/logs/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
            // We don't update UI here; redux thunk can use a progress callback by passing config.
        }
    });
    return resp.data;
};


export default { uploadFile };