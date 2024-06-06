'use client'


import React, {useEffect} from 'react'
import {useAuthContext} from '../context/AuthContext';

import Link from 'next'
const AdminView = () => {
    const { user } = useAuthContext();

    useEffect(() => {
        if (user == null) {
            // Perform client-side navigation using Link
            document.location.href = "/";
        }
    }, [user]);

    return (<h1>Only logged-in users can view this page</h1>);
}

export default AdminView