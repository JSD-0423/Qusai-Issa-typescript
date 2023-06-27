import jwt from 'jsonwebtoken';

const generateToken = (payload: any, secret: string) => {
	const token = jwt.sign(payload, secret);
	return token;
}

const decodeToken = (token: string, secret: string) => {
	const decoded = jwt.verify(token, secret);
	return decoded;
}