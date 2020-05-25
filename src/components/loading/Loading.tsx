import React, {useEffect, useState} from 'react';
import NProgress from "nprogress";

const Loading = () => {
  const initState = () => {
    NProgress.start()
  }
  let [state, setState] = useState(initState);

  useEffect(() => {
    NProgress.done()
  }, [])

  return <div/>
};

export default Loading;
