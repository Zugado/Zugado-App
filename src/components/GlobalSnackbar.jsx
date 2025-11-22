import React from 'react';
import { useSnackbar } from '../contexts/SnackbarContext';
import Snackbar from './Snackbar';

export default function GlobalSnackbar() {
  const { snackbar, hideSnackbar } = useSnackbar();

  return (
    <Snackbar
      visible={snackbar.visible}
      message={snackbar.message}
      type={snackbar.type}
      onHide={hideSnackbar}
    />
  );
}