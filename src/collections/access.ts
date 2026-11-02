import type { Access } from 'payload'

/** Staff (Payload admins) only. */
export const isStaff: Access = ({ req }) => req.user?.collection === 'admins'
export const anyone: Access = () => true
