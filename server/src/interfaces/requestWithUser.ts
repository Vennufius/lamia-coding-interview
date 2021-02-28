import { Request } from 'express';
import AuthUser from './authUser';
interface RequestWithUser extends Request {
  user?: AuthUser;
}

export default RequestWithUser;
