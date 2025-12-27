import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uploadReducer from './slices/uploadSlice';
import fileReducer from './slices/fileSlice';
import analyzeReducer from './slices/analyzeSlice';
import dashboardReducer from './slices/dashboardSlice';
import reportReducer from './slices/reportSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        upload: uploadReducer,
        files: fileReducer,
        dashboard:dashboardReducer,
        analyze: analyzeReducer,
        reports: reportReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});


export default store;