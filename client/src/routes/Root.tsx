import React, { useState, useEffect, FormEvent } from 'react';

interface IUser {
    id: number | null;
    username: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
}

const Root = () => {
    const [user, setUser] = useState<IUser>({ id: null, username: '', first_name: '', middle_name: undefined, last_name: '' });

    const [users, setUsers] = useState([]);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsername = (e: HTMLInputElement) => {
        setUsername(e.value);
    };

    const handlePassword = (e: HTMLInputElement) => {
        setPassword(e.value);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const URL = `http://localhost:3000/login`;
            const req = await fetch(URL, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: new URLSearchParams({
                    'username': username,
                    'password': password
                })
            });

            if (!req.ok) {
                throw Error;
            }

            const res = await req.json();

            if (res.loggedIn) {
                setUser(res.user);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        try {
            const URL = `http://localhost:3000/logout`;
            const req = await fetch(URL, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            });

            if (!req.ok) {
                throw Error;
            }

            const res = await req.json();

            if (!res.loggedIn) {
                setUser({ id: null, username: '', first_name: '', middle_name: undefined, last_name: '' });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleGetUsers = async () => {
        try {
            const URL = `http://localhost:3000/user/list`;
            const req = await fetch(URL, {
                method: 'GET',
                credentials: 'include',
            });

            if (!req.ok) {
                throw Error;
            }

            const res = await req.json();
            console.log(res);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='p-8 flex flex-col gap-8 w-full h-full justify-center items-center'>
            <div className='border border-slate-300 p-4 bg-white'>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <label className='flex flex-col' htmlFor="username">
                        Username
                        <input onChange={(e) => handleUsername(e.target)} type="text" name='username' id='username' />
                    </label>
                    <label className='flex flex-col' htmlFor="password">
                        Password
                        <input onChange={(e) => handlePassword(e.target)} type="password" name="password" id="password" />
                    </label>
                    <button className='border border-slate-300 px-4 py-2' type="submit">Login</button>
                </form>
            </div>
            <div className='flex flex-col gap-4'>
                <div>
                    <button onClick={handleGetUsers} className='border border-slate-300 px-4 py-2' type="button">Get Users</button>
                </div>
                <div className='w-full flex flex-col gap-2'>
                    {
                        users.length ? (
                            users.map((user: any, index) => {
                                return (
                                    <p key={index}>{`${user.first_name} ${user.last_name}`}</p>
                                )
                            })
                        ) : (
                            <p>Empty</p>
                        )
                    }
                </div>
            </div>
            <div>
                <button onClick={handleLogout} className='border border-red-500 text-red-500 px-4 py-2' type='button'>Logout</button>
            </div>
        </div>
    )
};

export default Root;