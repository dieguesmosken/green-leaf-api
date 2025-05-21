'use client';

import React, { useEffect, useState } from "react";

type IUser = {
    id: number;
    name: string;
    email: string;
    role: string;
};

export default function UsersPage() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Substitua a URL abaixo pela sua API real
        fetch("/api/users")
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div>Carregando usuários...</div>;
    }

    return (
        <div>
            <h1>Usuários</h1>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ccc", padding: 8 }}>ID</th>
                        <th style={{ border: "1px solid #ccc", padding: 8 }}>Nome</th>
                        <th style={{ border: "1px solid #ccc", padding: 8 }}>Email</th>
                        <th style={{ border: "1px solid #ccc", padding: 8 }}>Função</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={4} style={{ textAlign: "center", padding: 16 }}>
                                Nenhum usuário encontrado.
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td style={{ border: "1px solid #ccc", padding: 8 }}>{user.id}</td>
                                <td style={{ border: "1px solid #ccc", padding: 8 }}>{user.name}</td>
                                <td style={{ border: "1px solid #ccc", padding: 8 }}>{user.email}</td>
                                <td style={{ border: "1px solid #ccc", padding: 8 }}>{user.role}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}