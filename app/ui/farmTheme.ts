import { Button, createTheme, ThemeProvider } from "flowbite-react";

const farmTheme = createTheme({
  button: {
    color: {
      success: "mt-4 bg-green-500 hover:bg-green-600 w-full text-white",
    },
    // size: {
    //   lg: "px-6 py-3 text-lg",
    // },
  },
  radio: {
    color: {
      success: "text-green-500 focus:ring-green-500",
    },
  },
  textInput: {
    field: {
      input: {
        colors: {
          success:
            "border-gray-300 focus:border-green-300 bg-white placeholder:text-gray-500",
        },
      },
    },
  },
});

export default farmTheme;
