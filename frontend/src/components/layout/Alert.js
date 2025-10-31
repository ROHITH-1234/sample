import React from 'react';

const Alert = ({ alerts }) => {
  return (
    <div className="alert-wrapper">
      {alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
          {alert.msg}
        </div>
      ))}
    </div>
  );
};

export default Alert;