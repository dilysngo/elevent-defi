import {
  title,
  mrAuto,
  mlAuto,
  primaryColor,
  hoverColor,
  grayColor,
} from "assets/jss/material-kit-pro-react.js";
import { fade } from '@material-ui/core/styles';

import checkboxes from "assets/jss/material-kit-pro-react/customCheckboxRadioSwitchStyle.js";
import buttonGroup from "assets/jss/material-kit-pro-react/buttonGroupStyle.js";
import tooltips from "assets/jss/material-kit-pro-react/tooltipsStyle.js";
import filtersSection from 'assets/jss/components/sectionFiltersStyle.js';
import { rgbToHex } from "@material-ui/core";

// TODO: move to single place
const textSecondaryColor = '#94a3b8';
const fonts = 'Inter var,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji';

const secondStyle = {
  opacity: '0.4',
  fontFamily: 'Helvetica',
  fontSize: '14px',
  color: '#FFFFFF',
  letterSpacing: '0',
  lineHeight: '14px',
};

const sectionPoolsStyle = theme => ({
  mainTitle:{
    fontFamily: 'Helvetica',
    fontSize: '32px',
    color: '#FFFFFF',
    letterSpacing: '0',
    lineHeight: '32px',
    fontWeight: "300",
  },
  secondTitle:{
      ...secondStyle,
      fontWeight: "550",
  },
  title,
  mrAuto,
  mlAuto,
  ...checkboxes,
  ...buttonGroup,
  ...tooltips,

  ...filtersSection(theme),

  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    display: 'flex',
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
    display: "flex",
    justifyContent : "space-around",
    alignItems : "center",
    alignContent: "space-around",
  },
  space50: {
    height: "50px",
    display: "block"
  },
  padding0: {
    padding: "0 !important"
  },
  imgContainer: {
    width: "120px",
    maxHeight: "160px",
    overflow: "hidden",
    display: "block",
    "& img": {
      width: "100%"
    }
  },
  description: {
    maxWidth: "150px"
  },
  tdName: {
    minWidth: "200px",
    fontWeight: "400",
    fontSize: "1.5em"
  },
  tdNameAnchor: {
    color: grayColor[1]
  },
  tdNameSmall: {
    color: grayColor[0],
    fontSize: "0.75em",
    fontWeight: "300"
  },
  tdNumber: {
    textAlign: "right",
    minWidth: "150px",
    fontWeight: "300",
    fontSize: "1.125em !important"
  },
  tdNumberSmall: {
    marginRight: "3px"
  },
  tdNumberAndButtonGroup: {
    lineHeight: "1 !important",
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      marginRight: "0"
    },
    "& svg": {
      marginRight: "0"
    }
  },
  customFont: {
    fontSize: "16px !important"
  },
  actionButton: {
    margin: "0px",
    padding: "5px"
  },
  textCenter: {
    textAlign: "center"
  },
  textRight: {
    textAlign: "right"
  },
  floatRight: {
    float: "right"
  },
  justifyContentCenter: {
    WebkitBoxPack: "center !important",
    MsFlexPack: "center !important",
    justifyContent: "center !important"
  },
  signInButton: {
    "& button": {
      marginRight: "5px"
    }
  },
  cardWrap: {
    minHeight: '170px',
  },
  iconContainerMainTitle:{
    fontSize: '18px',
    fontWeight: '300',
    color: '#fff',
    lineHeight: '18px',
    // marginBottom:'8px',
    letterSpacing: 0,
  },
  iconContainerSubTitle:{
    fontSize: '14px',
    fontWeight: '300',
    color: '#fff',
    lineHeight: '14px',
    opacity: "0.4",
    letterSpacing: 0
  },
  poolTvl:{
    fontSize: '14px',
    fontWeight: '300',
    color: '#fff',
    lineHeight: '14px',
    letterSpacing: 0,
    marginBottom: '5px'
  },
  iconContainerSecond: {
      width:'48px',
      height:'48px',
      backgroundColor:'#353848',
      borderRadius:'8px',
      color:primaryColor[0],

      "& i": {
        fontSize: '24px',
      },
      "&:hover,&:focus": {
        backgroundColor: hoverColor[1],
      }
  },
  iconContainerPrimary: {
      width:'48px',
      height:'48px',
      backgroundColor:'#242833',
      borderRadius:'8px',
      color:'#fff',
      "& i": {
        fontSize: '24px',
      },
      "&:hover,&:focus": {
        opacity: 0.5,
        background:'#242833',
      }
  },
    accordion:{
        backgroundColor:'#2C3040',
        color:'#fff',
        boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.06)',
        borderRadius: '8px',
    },
    details:{
      // padding: '12px 0',
      background: '#2C3040',
      boxShadow: '0 4px 8px 0 rgba(0,0,0,0.06)',
      borderRadius: '8px',
    },
    track: {
          height: 4,
          borderRadius: 2,
        },
    sliderDetailContainer:{
      padding: '24px 16px',
    },
    showDetail:{
        display:'inline-block',
        alignItems:'center',
        justifyContent:'space-around',
        width:'100%',
        height: '56px',
        background: '#353848',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '18px',
        color: '#FFFFFF',
        lineHeight: '24px',
        fontWeight: '600',
    },
    depositedBalanceSliderRoot:{
      color:'#ff635a',
    },
    depositedBalanceSliderMarkLabel:{
      color:'#ff635a',
    },
    drawSliderRoot:{
      color:'#635AFF',
    },
    drawSliderMarkLabel:{
      color:'#635AFF'
    },
    showDetailLeft:{
        float: 'left',
        margin: '16px 24px',
        fontSize: '18px',
        color: '#FFFFFF',
        lineHeight: '24px',
        fontWeight: '600',
    },
    showDetailRight:{
        float: 'right',
        fontSize: '12px',
        lineHeight: '18px',
        color: '#FFFFFF',
        opacity: '.4',
        fontWeight: '600',
    },

    MuiSliderRoot:{
        color: '#C7971C',
    },
    showDetailButtonCon:{
        display:'flex',
        justifyContent:'space-around',
        '& + &': {
          marginLeft: '5px'
        }
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    margin: {
      marginRight: '5px'
    },
    hideIconPadding: {
      "& .MuiSelect-outlined": {
        paddingRight: "0px"
      },
      paddingRight: '0px'
    },

    poolBalanceBlock: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 5px',
      marginBottom: '10px',

      fontFamily: fonts,
      fontSize: '18px',
		  fontWeight: 'bold',
    },
    poolBalance: {
      textAlign: 'right'
    },
    poolBalanceToken: {
      fontSize: '16px',
      fontWeight: 'normal'
    },
    poolBalanceDescription: {
      fontSize: '16px',
      fontWeight: 'normal',
      textAlign: 'right',
      color: textSecondaryColor,
    }
});

export default sectionPoolsStyle;
