import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clientId:localStorage.getItem("token") || null ,
  feedbacks: [{}],
  userSearches:localStorage.getItem("UserSearches") || []
};

const pagesSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    setClientId:(state , action)=>{
      state.clientId = action.payload
    },
     setFeedbacks : (state , action) => {
           state.feedbacks = action.payload ;
     },
     setUserHistory : (state ,action)=> {
       state.userSearches = [...state , action.payload]
     }
  },
});

export const {
  setFeedbacks ,
  setUserHistory ,
  setClientId
} = pagesSlice.actions;

export default pagesSlice.reducer;
