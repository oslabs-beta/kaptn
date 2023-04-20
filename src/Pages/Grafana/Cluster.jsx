import React, { useState, useEffect } from 'react';
import SideNav from '../../components/Sidebar';

function Cluster() {
  return (
    <div>
      <SideNav />
      <iframe
        src='http://localhost:3000/d/09ec8aa1e996d6ffcd6817bbaff4db1b/kubernetes-api-server?orgId=1&refresh=10s&kiosk'
        style={{
          position: 'absolute',
          height: '100%',
          width: '94%',
          border: 'none',
          right: 0,
          top: 0,
        }}
      ></iframe>
    </div>
  );
}

export default Cluster;
