import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

export const SpinModal = () => {
  return (
    <Stack 
        sx={{ 
            width: '100vw', 
            color: 'grey.500', 
            height:'100vh', 
            flexDirection:'column', 
            justifyContent:'center',
            position:'absolute',
            padding:50,
            opacity:1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex:999,
            }} 
            spacing={2}>
      <LinearProgress color="primary"/>
      <LinearProgress color="secondary" />
      <LinearProgress color="primary" />
    </Stack>
  );
}

