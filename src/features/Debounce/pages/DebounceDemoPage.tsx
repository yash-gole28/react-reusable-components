// features/DebounceDemo/pages/DebounceDemoPage.tsx

import { useEffect, useState } from "react";

import { useDebounceValue } from "./../hooks/useDebounceValue";
import { useDebouncedCallback } from "./../hooks/useDebouncedCallback";

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
};

type UsersResponse = {
    users: User[];
};

export default function DebounceDemoPage() {
    const [search, setSearch] = useState("");

    const [users, setUsers] = useState<User[]>([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const debouncedSearch =
        useDebounceValue(search, 500);


    useEffect(() => {
        const fetchUsers = async () => {
            // if (!debouncedSearch.trim()) {
            //     setUsers([]);
            //     return;
            // }

            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `https://dummyjson.com/users/search?q=${debouncedSearch}`
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch users"
                    );
                }

                const data: UsersResponse =
                    await response.json();

                setUsers(data.users);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [debouncedSearch]);

    /*
    -----------------------------------
    DEBOUNCED CALLBACK
    -----------------------------------
    */

    const debouncedLogger = useDebouncedCallback(
        (value: string) => {
            console.log(
                "Debounced Callback:",
                value
            );
        },
        1000
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-10">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">
                    Debounce Search Demo
                </h1>

                {/* INPUT */}

                <div className="mb-8">
                    <label className="block mb-2 text-sm text-zinc-400">
                        Search Users
                    </label>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            const value =
                                e.target.value;

                            setSearch(value);

                            debouncedLogger(value);
                        }}
                        placeholder="Type user name..."
                        className="
                            w-full
                            rounded-2xl
                            border
                            border-zinc-700
                            bg-zinc-900
                            px-4
                            py-3
                            text-white
                            outline-none
                            transition
                            focus:border-blue-500
                        "
                    />
                </div>

                {/* INFO */}

                <div className="mb-6 text-sm text-zinc-500">
                    API request fires only after
                    user stops typing for 500ms
                </div>

                {/* LOADING */}

                {loading && (
                    <div className="mb-4 text-zinc-400">
                        Searching users...
                    </div>
                )}

                {/* ERROR */}

                {error && (
                    <div className="mb-4 text-red-400">
                        {error}
                    </div>
                )}

                {/* RESULTS */}

                <div className="space-y-4">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="
                                flex
                                items-center
                                gap-4
                                rounded-2xl
                                border
                                border-zinc-800
                                bg-zinc-900
                                p-4
                            "
                        >
                            <img
                                src={user.image}
                                alt={user.firstName}
                                className="
                                    h-14
                                    w-14
                                    rounded-full
                                    object-cover
                                "
                            />

                            <div>
                                <h2 className="font-semibold">
                                    {user.firstName}{" "}
                                    {user.lastName}
                                </h2>

                                <p className="text-sm text-zinc-400">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* EMPTY */}

                {!loading &&
                    debouncedSearch &&
                    users.length === 0 && (
                        <div className="mt-6 text-zinc-500">
                            No users found
                        </div>
                    )}
            </div>
        </div>
    );
}