import "dotenv/config";

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


export const sendMail = (email, verificationToken) => {
    const message = {
        to: email,
        from: "mashabatyuta.work@gmail.com",
        subject: "Please Verify Your Identity",
        html: `<div style="
            width: 360px;
            padding: 12px;
            border: 1px solid grey;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-align: center;
            margin: 0 auto;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            ">
            <h3 style="margin-bottom: 20px;">Let's verify your identity <span>email</span></h3>
            <a href="http://localhost:3000/api/users/verify/${verificationToken}" style="
                display: block;
                padding: 10px 20px;
                background-color: skyblue;
                color: white;
                text-decoration: none;
                border: 1px solid grey;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
            "> Click to Verify</a>
            </div> 
            `,
        text: `Let's verify your identity email. Go to: http://localhost:3000/api/users/verify/${verificationToken}`
    }
    
    return sgMail.send(message);
};