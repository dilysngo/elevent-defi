import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Avatar from '@material-ui/core/Avatar';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import { purple } from '@material-ui/core/colors';
import './ModalGradient.css';
import './AvatarAnimation.css';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    textAlign: 'center',
    backgroundColor: '#2C3040',
    color: '#fff',
    borderRadius: '8px',
    overflow: 'auto',
    boxShadow: theme.shadows[5],
    padding: 0,
    width: "40%",
    minWidth: "320px"
  },
  mainTitle:{
    fontFamily: 'Helvetica',
    fontSize: '24px',
    color: '#FFFFFF',
    letterSpacing: '0',
    lineHeight: '32px',
    fontWeight: "550",
    marginTop: '5px'
  },
  currencyContainer:{
    '& > div': {
        margin: '35px auto 25px'
    },
    '& p': {
        fontSize: '50px',
        fontFamily: 'Helvetica',
        color: '#FFFFFF',
        letterSpacing: '0',
        lineHeight: '32px',
        fontWeight: "550",
        marginTop: '5px',
    }
  },
  table: {
    fontSize: '26px'
  },
  tableCell: {
    color: "#fff",
    fontSize: '16px'
  },
}));

const ColorButton = withStyles((theme) => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: '#c7971c',
        '&:hover': {
            backgroundColor: '#998f32',
        },
    },
}))(Button);


function createData(key, value) {
    return { key, value };
}

const rows = [
    createData("Balance:", "0.00"),
    createData("Unclaimed:", "0.0000"),
    createData("ELE price:", "$0.00"),
    createData("ELE in circulation:", "0,00"),
    createData("Total Supply", "5,500,000")
];

export default function RewardModal(props) {
  const classes = useStyles();

  return (
    <div>
      <Modal
        className={classes.modal}
        open={props.isOpen}
        onClose={props.closeRewardModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.isOpen}>
          <div className={classes.paper}>
            <div className='modal-gradient'>
                <h2 id="transition-modal-title" className={classes.mainTitle}>Claim airdrop</h2>

                <div className={classes.currencyContainer}>
                    <div className="avatarWrapper">
                        <Avatar alt="ELEVEN" src={require(`../../images/11-logo.png`)} />
                    </div>
                    <p>0.00 (TBA)</p>
                </div>

                <TableContainer>
                    <Table className={classes.table} aria-label="simple table">
                        <TableBody>
                            {rows.map(row => (
                                <TableRow key={row.key}>
                                    <TableCell className={classes.tableCell} component="th" scope="row">
                                        {row.key}
                                    </TableCell>
                                    <TableCell className={classes.tableCell} align="right">
                                        {row.value}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <br />
                <ColorButton 
                    variant="contained"
                    color="primary"
                    onClick={() => { console.log("claim reward..."); }}
                >
                    Claim Reward
                </ColorButton>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
