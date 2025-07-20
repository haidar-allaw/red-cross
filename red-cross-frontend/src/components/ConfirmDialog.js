import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField } from '@mui/material';

export default function ConfirmDialog({
    open,
    title,
    content,
    onClose,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
    showInput = false,
    inputLabel = "",
    inputValue = "",
    setInputValue = () => { },
}) {
    return (
        <Dialog open={open} onClose={() => onClose(false)} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
            <DialogContent>
                <Typography sx={{ mb: showInput ? 2 : 0 }}>{content}</Typography>
                {showInput && (
                    <TextField
                        autoFocus
                        margin="dense"
                        label={inputLabel}
                        type="text"
                        fullWidth
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)} color="inherit" variant="outlined">{cancelText}</Button>
                <Button onClick={() => onClose(true)} color="primary" variant="contained">{confirmText}</Button>
            </DialogActions>
        </Dialog>
    );
} 