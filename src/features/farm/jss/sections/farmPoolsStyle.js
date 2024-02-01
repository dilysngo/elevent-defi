const backgroundMain = 'rgba(42,48,66,.7490196078431373);';

const textNormalColor = '#ffffff';
const textSecondaryColor = '#94a3b8';

const primaryColor = '#f0b90b';
const primaryColorHover = '#dcab10';
const primaryContrastColor = 'rgb(30, 41, 59)';

const fonts = 'Inter var,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji';

const dialogStyles = (theme) => ({
	dialogRoot: {
		background: "rgb(81,88,116)",
		color: '#ffffff'
	},
	dialogHref: {
		marginLeft: 10,
		cursor: 'pointer',
		color: "#32B0FF"
	},
	dialogInput: {
		color: "#ffffff"
	},
	dialogAction: {
		width: 80,
		textAlign: 'center',
		fontSize: 15,
		fontWeight: 450,
		cursor: 'pointer'
	},
	dialogTextBtn: {
		'& > *': {
			margin: theme.spacing(1),
		}
	}
})

const farmPoolStyle = (theme) => ({
	farmWrapper: {
		fontFamily: fonts,
		backgroundColor: backgroundMain,
		borderRadius: '6px',
		marginTop: '20px',
		color: textNormalColor,
		overflow: 'hidden',

		[theme.breakpoints.down('sm')]: {
			marginTop: 0
		}
	},

	farmDetails: {
		[theme.breakpoints.up('md')]: {
            borderRight: '1px solid rgba(241, 245, 249, 0.12)',
        }
	},
	farmTitleBlock: {
		padding: '20px 25px 15px',
		borderBottom: '1px solid rgba(241, 245, 249, 0.12)',

		[theme.breakpoints.down('sm')]: {
			flexDirection: 'column',
			textAlign: 'center',
		}
	},
	farmTitle: {
		fontSize: '24px',
		fontWeight: 'bold',
		lineHeight: '40px'
	},
	farmLpValue: {
		fontSize: '20px',
		color: textSecondaryColor,
		fontWeight: 'bold',
		marginBottom: '-10px',

		[theme.breakpoints.down('xs')]: {
			fontSize: '18px',
			margin: '0 -10px'
		}
	},
	farmLpValueToken: {
		fontSize: '14px',
		fontWeight: 'normal'
	},
	farmLpValueUsd: {
		fontSize: '18px',

		[theme.breakpoints.down('xs')]: {
			display: 'block',
			marginBottom: '5px'
		}
	},
	farmLpValueLoader: {
		marginLeft: '5px',
		position: 'relative',
		top: '3px',
		color: textSecondaryColor
	},
	farmLogo: {
		height: '35px',
		marginRight: '25px',

		[theme.breakpoints.down('sm')]: {
			height: '50px',
			margin: '0 0 15px 0'
		}
	},

	farmControls: {
		padding: '25px',

		[theme.breakpoints.down('md')]: {
            textAlign: 'center'
        },

		'& > *': {
			[theme.breakpoints.down('sm')]: {
				marginBottom: '30px'
			},
		}
	},
	farmBalance: {
		fontSize: '30px',
		fontWeight: 'bold',
		margin: '10px 0 8px'
	},
	farmBalanceDescription: {
		color: textSecondaryColor,
		fontSize: '16px',
		marginBottom: '20px',

		[theme.breakpoints.down('sm')]: {
			marginBottom: '10px'
		}
	},

	farmEarnings: {
		padding: '25px',
		textAlign: 'center',

		[theme.breakpoints.down('sm')]: {
			paddingTop: 0,
			marginTop: '-20px'
		},
	},
	farmEarnedLogo: {
		margin: '14px 0 30px',

		[theme.breakpoints.down('sm')]: {
			marginTop: 0
		},

		'& img': {
			height: '60px',
		}
	},

	buttonPrimary: {
		backgroundColor: primaryColor,
		color: primaryContrastColor,
		fontFamily: fonts,
		fontSize: '14px',
		fontWeight: '500',
		boxShadow: '0 0 0 0 rgb(0 0 0 / 20%), 0 0 0 0 rgb(0 0 0 / 14%), 0 0 0 0 rgb(0 0 0 / 12%)',

		'&:hover': {
			backgroundColor: primaryColorHover,
			color: primaryContrastColor,
			boxShadow: '0 0 0 0 rgb(0 0 0 / 20%), 0 0 0 0 rgb(0 0 0 / 14%), 0 0 0 0 rgb(0 0 0 / 12%)',
		},

		'&:focus': {
			backgroundColor: primaryColorHover,
			color: primaryContrastColor,
			boxShadow: '0 0 0 0 rgb(0 0 0 / 20%), 0 0 0 0 rgb(0 0 0 / 14%), 0 0 0 0 rgb(0 0 0 / 12%)',
		},

		'&:active': {
			backgroundColor: primaryColor,
			color: primaryContrastColor,
		}
	},

	...dialogStyles(theme)
})

export default farmPoolStyle;
