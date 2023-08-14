import React from 'react'

export default function useAssociateDoctor({doctors,doctorId}) {
    const user = doctors?.find((doc) => doc._id == doctorId);
    return user?.user.name;
}
