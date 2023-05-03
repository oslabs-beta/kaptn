import SideNav from '../components/Sidebar';
import Grid from '@mui/system/Unstable_Grid';

function Cluster() {
  return (
    <>
      <Grid
        id='cluster'
        container
        disableEqualOverflow='true'
        width={'100vw'}
        height={'95vh'}
        sx={{ pt: 3, pb: 3 }}
      >
        <SideNav />
      <h1>Coming soon...</h1>
      </Grid>
    </>
  );
}

export default Cluster;
