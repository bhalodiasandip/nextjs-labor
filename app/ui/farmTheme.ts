import { Button, createTheme, ThemeProvider } from "flowbite-react";

const farmTheme = createTheme({
  button: {
    color: {
      success: "mt-4 bg-green-500 hover:bg-green-600 text-white",
    },
    outlineColor: {
      red: "mt-4 border border-red-500 text-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white focus:ring-red-300 dark:border-red-600 dark:text-red-500 dark:hover:border-red-700 dark:hover:bg-red-700 dark:hover:text-white dark:focus:ring-red-800",
      success:
        "mt-4 bg-green-50 hover:bg-green-200 border-gray-300 ring-1 ring-green-200 text-green-500 ",
    },
    // size: {
    //   lg: "px-6 py-3 text-lg",
    // },
  },

  radio: {
    color: {
      success: "text-green-500 focus:ring-green-500 bg-white",
    },
  },
  select: {
    field: {
      select: {
        colors: {
          success:
            "border-gray-300 bg-white focus:border-green-300 placeholder:text-gray-50",
        },
      },
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
  textarea: {
    colors: {
      success:
        "border-gray-300 focus:border-green-300 bg-white placeholder:text-gray-500",
    },
  },
  checkbox: {
    color: {
      success:
        "h-4 w-4 text-green-500 focus:ring-green-500 bg-white checked:bg-check-icon checked:border-transparent checked:bg-current",
    },
  },
  tabs: {
    tablist: {
      tabitem: {
        variant: {
          pills: {
            active: {
              on: "rounded-lg bg-green-500 text-white",
              off: "rounded-lg bg-gray-100 hover:bg-green-100",
            },
          },
        },
      },
    },
  },
  datepicker: {
    root: {
      input: {
        field: {
          input: {
            colors: {
              success:
                "border-gray-300 focus:border-green-300 bg-white placeholder:text-gray-500",
            },
          },
        },
      },
    },
    views: {
      days: {
        items: {
          item: {},
        },
      },
    },
  },
});

export default farmTheme;
