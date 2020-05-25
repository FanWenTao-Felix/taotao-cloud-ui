import Loadable from 'react-loadable'
import 'nprogress/nprogress.css'
import Loading from "../components/loading/Loading"

const loadable = (loader: any, loading = Loading) => {
  return Loadable({
    loader,
    loading
  })
}

export default loadable;
