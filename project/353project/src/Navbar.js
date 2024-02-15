function Navbar() {
  const handleLogout = () => {
    window.localStorage.clear();
  };

  return (
    <nav className="Nav">
      <a href="/home" className="site-home">
        Myint Soe Book
      </a>
      <ul>
        <li>
          <a href="/profile">Profile</a>
        </li>
        <li>
          <a href="/accounts">All Accounts</a>
        </li>
        <li>
          <a href="/channels">Channels</a>
        </li>
      </ul>
      <a href="/" className="log-out" onClick={handleLogout}>
        Log Out
      </a>
    </nav>
  );
}

export default Navbar;
