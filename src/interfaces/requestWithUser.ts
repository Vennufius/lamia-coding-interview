import { Request } from 'express';
interface RequestWithUser extends Request {
  user?: AuthUser;
}

export default RequestWithUser;
