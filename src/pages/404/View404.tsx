import React, {useState} from 'react';
import img from '../../assets/images/404.jpg';

const View404: React.FC = () => {
  let [state, setState] = useState({animated: ''});
  const enter = () => {
    setState({animated: 'hinge'});
  };
  return (
      <div
          className="center"
          style={{height: '100%', background: '#ececec', overflow: 'hidden'}}
      >
        <img
            src={img}
            alt="404"
            className={`animated swing ${state.animated}`}
            onMouseEnter={enter}
        />
      </div>
  );
};

export default View404;
