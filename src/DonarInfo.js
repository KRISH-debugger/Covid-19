import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }));


function DonarInfo() {
    const classes = useStyles();

    return (
        <div>
            <h1>Donar info</h1>
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
            <Button variant="contained" color="primary">Upload</Button>

        </div>
    )
}

export default DonarInfo;
