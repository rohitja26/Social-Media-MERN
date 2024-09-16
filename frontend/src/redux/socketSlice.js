import { createSlice } from "@reduxjs/toolkit";

const sockectSlice = createSlice({
     name: 'socketio',
     initialState: {
          socket: null
     },

     reducers: {
          //actions
          setSocket: (state, action) => {
               state.socket = action.payload
          }
     }
})

export const { setSocket } = sockectSlice.actions
export default sockectSlice.reducer