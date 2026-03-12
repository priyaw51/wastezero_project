import React, { useState, useEffect } from "react";
import axios from "axios";

const NotificationBell = () => {

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {

    const fetchNotifications = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:3000/api/notifications",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setNotifications(res.data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchNotifications();

  }, []);

  return (

    <div style={{ position: "relative", marginRight: "20px" }}>

      <button
        onClick={() => setOpen(!open)}
        style={{
          fontSize: "22px",
          background: "none",
          border: "none",
          cursor: "pointer"
        }}
      >
        🔔
      </button>

      {notifications.length > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            background: "red",
            color: "white",
            borderRadius: "50%",
            padding: "3px 7px",
            fontSize: "12px"
          }}
        >
          {notifications.length}
        </span>
      )}

      {open && (

        <div
          style={{
            position: "absolute",
            right: 0,
            top: "35px",
            width: "250px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px"
          }}
        >

          <h4>Notifications</h4>

          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (

            notifications.map((n) => (

              <div key={n._id} style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                {n.message}
              </div>

            ))

          )}

        </div>

      )}

    </div>

  );
};

export default NotificationBell;