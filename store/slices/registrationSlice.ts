import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RegistrationState {
  village_id: string;
  full_name: string;
  contact_number: string;
  password: string;
  role: "labor" | "farmer" | "";
}

const initialState: RegistrationState = {
  village_id: "",
  full_name: "",
  contact_number: "",
  password: "",
  role: "",
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setRegistrationData: (state, action: PayloadAction<RegistrationState>) => {
      return action.payload;
    },
    clearRegistrationData: () => initialState,
  },
});

export const { setRegistrationData, clearRegistrationData } =
  registrationSlice.actions;
export default registrationSlice.reducer;
