import React, { useState, useEffect } from 'react'

const useUser = () => {
    const [user, setUser] = useState<Object>({});

    return { user }
};

export default useUser;