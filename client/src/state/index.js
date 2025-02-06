import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token:null,
    allChats:[],
    currentChatMessages:[],
}

export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setLogin:(state,action) =>{
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout:(state) =>{
            state.user = null;
            state.token = null;
        },
        setAllChats:(state,action) =>{
            state.allChats = action.payload;
        },
        setCurrentChatMessages:(state,action) =>{
            state.currentChatMessages = action.payload;
        },
    }
})

export const {setLogin,setLogout,setAllChats,setCurrentChatMessages} = authSlice.actions;

export default authSlice.reducer;