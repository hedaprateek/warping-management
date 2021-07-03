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
  },
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
        },
        MuiTab: {
            size: 'small',
        },
        MuiIconButton: {
            size: 'small',
            disableTouchRipple: true,
        }
    },
    overrides: {
        MuiTabs: {
            root: {
                minHeight: 0,
            },
            indicator: {
                height: '3px',
            }
        },
        MuiTab: {
            root: {
                minHeight: 0,
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
                textTransform: 'none'
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
                minHeight: '34px',
            }
        },
        MuiOutlinedInput: {
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
        }
    },
    otherVars: {
        reactSelect: {
            padding: '5px 8px',
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