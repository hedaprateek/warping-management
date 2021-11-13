import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const defaultTheme = createMuiTheme();

const globalTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#016FB9',
      main: '#2364AA',
      light: '#cbe3f5',
      dark: '#064879',
    },
    secondary: {
      main: '#B0413E',
      light: '#ffd8d7',
    },
    info: {
      main: '#fde74c',
    },
    background: {
        default: '#fff',
    }
  },
  typography: {
    fontSize: 14,
    // htmlFontSize: 16,
  },
  shape: {
      borderRadius: 0,
  }
});

export const theme = createMuiTheme({
    mixins: {
        ...globalTheme.mixins,
        border: '1px solid '+globalTheme.palette.grey[300]
    },
    transitions: {
        duration: {
          shortest: 50,
          shorter: 100,
          short: 150,
          standard: 200,
          complex: 175,
          enteringScreen: 125,
          leavingScreen: 95,
        }
    },
    props: {
        MuiTextField: {
            size: 'small',
            variant: 'outlined',
        },
        MuiButton: {
            size: 'small',
            disableTouchRipple: true,
            disableElevation: true,
        },
        MuiTab: {
            size: 'small',
            disableFocusRipple: true,
        },
        MuiIconButton: {
            size: 'small',
            disableTouchRipple: true,
        },
        MuiCard: {
            variant: 'outlined',
        },
    },
    overrides: {
        MuiTabs: {
            root: {
                minHeight: 0,
            },
            indicator: {
                height: '2px',
                transition: 'none',
            }
        },
        MuiTab: {
            root: {
                minHeight: 0,
                lineHeight: 1.5,
                padding: '4px 10px',
                [defaultTheme.breakpoints.up('sm')]: {
                    minWidth: '80px',
                },
            },
            textColorInherit: {
                textTransform: 'none',
                opacity: 1,
            }
        },
        MuiButton: {
            root: {
                textTransform: 'none',
                lineHeight: 1.5,
            },
            containedSizeSmall: {
                fontSize: 'inherit',
            },
            sizeSmall: {
                padding: '3px 9px',
            }
        },
        MuiFormLabel: {
            root: {
                color: defaultTheme.palette.text.primary,
                fontSize: defaultTheme.typography.fontSize,
            },
            asterisk: {
                color: defaultTheme.palette.error.main,
            }
        },
        MuiToolbar: {
            dense: {
                minHeight: '30px',
            }
        },
        MuiOutlinedInput: {
            root: {
                fontSize: '14px',
            },
            input: {
                '&[readonly]':{
                    backgroundColor: defaultTheme.palette.grey[200],
                    opacity: 0.75
                }
            },
            inputMarginDense: {
                padding: defaultTheme.spacing(1, 1),
                paddingTop: defaultTheme.spacing(0.75),
                paddingBottom: defaultTheme.spacing(0.75),
            },
            adornedEnd: {
                paddingRight: defaultTheme.spacing(0.5),
            },
            notchedOutline: {
                '.MuiOutlinedInput-root.Mui-focused &': {
                    borderWidth: '1px',
                }
            }
        },
        MuiAutocomplete: {
            inputRoot: {
                padding: '0px',
            }
        },
        MuiDialogTitle: {
            root: {
                padding: defaultTheme.spacing(1),
            }
        },
        MuiDialogContent: {
            dividers: {
                padding: defaultTheme.spacing(1, 2),
            }
        },
        MuiIconButton: {
            sizeSmall: {
                padding: 0,
            }
        },
        MuiTypography: {
            body1: {
                fontSize: 'inherit',
            }
        },
        MuiCardHeader: {
            root: {
                padding: defaultTheme.spacing(1, 2)
            }
        },
        MuiCardContent: {
            root: {
                padding: defaultTheme.spacing(1, 2)
            }
        },
    },
    otherVars: {
        reactSelect: {
            padding: '4px 8px',
        }
    }
}, globalTheme);

export default function Theme(props) {
    return (
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>
    )
}