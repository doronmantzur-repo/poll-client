import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import authStore from "../stores/AuthStore";

function UserMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!authStore.isAuthenticated) {
    return null;
  }

  const namePart = authStore.user.user_name.split("@")[0];
  const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

  function handleLogout() {
    setOpen(false);
    authStore.logout();
  }

  return (
    <div className="user-menu" ref={containerRef}>
      <button type="button" className="user-menu-trigger" onClick={() => setOpen((o) => !o)}>
        <span className="user-avatar">{displayName.charAt(0)}</span>
        {displayName}
      </button>

      {open && (
        <div className="user-menu-dropdown">
          <button type="button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default observer(UserMenu);
