import { useState } from "react";
import "../styles/dashboard.css";


function AdminTable({ requests, ngos, assignNgo }) {
    const [users, setUsers] = useState([
        { id: 1, name: "Rahul", role: "User", status: "Active" },
        { id: 2, name: "Priya", role: "NGO", status: "Pending" },
        { id: 3, name: "Aman", role: "User", status: "Active" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    const handleDelete = (id) => {
        const filteredUsers = users.filter((user) => user.id !== id);
        setUsers(filteredUsers);
    };

    const handleEdit = (id) => {
        alert("Edit user with ID: " + id);
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );



    return (
        <div className="table-container">
            <h3>Recent Users</h3>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search by name or role..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req) => (
                        <tr key={req.id}>
                            <td>{req.id}</td>
                            <td>{req.wasteType}</td>
                            <td>{req.address}</td>
                            <td>
                                <span className={`status ${req.status.toLowerCase()}`}>
                                    {req.status}
                                </span>
                            </td>

                            <td>
                                {req.status === "Pending" && (
                                    <select
                                        onChange={(e) =>
                                            assignNgo(req.id, e.target.value)
                                        }
                                    >
                                        <option value="">Assign NGO</option>
                                        {ngos.map((ngo) => (
                                            <option key={ngo} value={ngo}>
                                                {ngo}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {req.assignedTo && (
                                    <span>{req.assignedTo}</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>


            </table>
        </div>
    );

}

export default AdminTable;
