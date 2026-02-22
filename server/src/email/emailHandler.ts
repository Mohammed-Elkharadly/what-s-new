import { createWelcomeEmailTemplate } from './emailTemplate.js';
import { resend, sender } from '../lib/resend.js';
import { CustomError } from '../utils/customError.js';
import { StatusCodes } from 'http-status-codes';

export const welcomeEmail = async (
  name: string,
  email: string,
  clientUrl: string,
) => {
  const { data, error } = await resend.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: [email],
    subject: 'Welcom to Real-time Chat-app',
    html: createWelcomeEmailTemplate(name, clientUrl),
  });
  if (error) {
    throw new CustomError(
      'Faild To Send Welcom Email',
      StatusCodes.BAD_REQUEST,
    );
  }
  console.log(data);
  return data;
};
