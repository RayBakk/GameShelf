import API from '../api';

const Settings = () => {

  const deleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    try {
      await API.delete('/auth/users/me');
      localStorage.removeItem('token');
      alert('Account deleted. You will be redirected to the register page.');
      window.location.href = '/register';
    } catch (err) {
      alert('Account deletion failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const deleteAllGames = async () => {
    if (!window.confirm('This will remove ALL your games. Continue?')) return;
    try {
      await API.delete('/games');
      alert('All games removed!');
    } catch (err) {
      alert('Failed to remove games: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="danger-zone">
        <button onClick={deleteAllGames} className="danger-btn">
          Delete All Games
        </button>
        <button onClick={deleteAccount} className="danger-btn">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;
