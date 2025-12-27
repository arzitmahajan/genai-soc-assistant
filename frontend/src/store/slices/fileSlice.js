import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import fileService from "../../services/fileService";

export const fetchUserFiles = createAsyncThunk(
    "files/fetchUserFiles",
    async (user_id, { rejectWithValue }) => {
        try {
            const data = await fileService.fetchUserFiles(user_id);
            return data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.detail || "Failed to fetch user files");
        }
    }
)
export const deleteUserFile = createAsyncThunk(
    "files/deleteUserFile",
    async ({ user_id, filename }, { rejectWithValue }) => {
        try {
            const data = await fileService.deleteUserFile(user_id, filename);
            return filename;
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || "Failed to delete file");
        }
    }
);
const fileSlice = createSlice({
    name: 'files',
    initialState: {
        files: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserFiles.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchUserFiles.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.files = action.payload;
            })
            .addCase(fetchUserFiles.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(deleteUserFile.fulfilled, (state, action) => {
                state.files = state.files.filter(f => f.filename !== action.payload);
            });
    },
})

export default fileSlice.reducer;