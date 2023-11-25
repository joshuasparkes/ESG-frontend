// BackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <Button
            startIcon={<ArrowBackIosIcon />}
            onClick={() => navigate(-1)}
            variant="outlined"
            style={{borderWidth:'0px', color: 'grey'}}
        />
    );
};

export default BackButton;
