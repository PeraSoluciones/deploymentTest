const Notification = ({ message }) => {
  if (message === null) return null;
  return (
    <div className={message.error ? 'error' : 'success'}>
      {message.error ? message.error : message?.success}
    </div>
  );
};

export default Notification;
