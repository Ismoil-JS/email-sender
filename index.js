import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' });

app.get('/', (_, res) => {
    res.send('This is for email sender app');
});

app.post('/', upload.single('resume'), (req, res) => {
    if (!req.body.fullName || !req.body.email || !req.body.phoneNumber || !req.body.driverType || !req.body.location || !req.body.about || !req.file){
        return res.status(400).json({
            message: 'All fields are required',
        });
    } else {
    const message = `
        <h2>New Truck Driver Application Form Submission</h2>
        <p><strong>Full Name:</strong> ${req.body.fullName}</p>
        <p><strong>Email:</strong> ${req.body.email}</p>
        <p><strong>Phone Number:</strong> ${req.body.phoneNumber}</p>
        <p><strong>Driver Type:</strong> ${req.body.driverType}</p>
        <p><strong>Location:</strong> ${req.body.location}</p>
        <p><strong>Experience (1 year):</strong> ${req.body.experience}</p>
        <p><strong>About:</strong> ${req.body.about}</p>
    `;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'newtruckdriverapplication@gmail.com', 
          pass: 'ionc snty hlmh nstf' 
        }
    });

    const mailOptions = {
        from: 'newtruckdriverapplication@gmail.com', // Sender's email address
        to: 'hr@7starsllc.com',
        subject: 'New truck driver application form submission',
        html: message, // Use HTML content for the email body
        attachments: [
            {
                filename: req.file.originalname, // Use the original filename for the attachment
                path: req.file.path, // Path to the uploaded file
            }
        ]
    };

    transporter.sendMail(mailOptions, function(error, info){
        // Always delete the uploaded file after sending the email
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } 
        });

        if (error) {
            res.status(500).send('Error while sending email');
        } else {
            res.send('Email sent successfully');
        }
    });
}});

app.listen(9000);
