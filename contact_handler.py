#!/usr/bin/env python3
"""
Python alternative for handling contact form submissions.
This script saves data to Excel and can send email notifications.

Requirements:
    pip install flask flask-cors openpyxl python-dotenv

Usage:
    python contact_handler.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import openpyxl
from openpyxl import Workbook
from datetime import datetime
import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv()

app = Flask(__name__)
CORS(app)

EXCEL_FILE = 'customer_inquiries.xlsx'

def init_excel():
    """Initialize Excel file if it doesn't exist"""
    if not os.path.exists(EXCEL_FILE):
        wb = Workbook()
        ws = wb.active
        ws.title = "Inquiries"
        ws.append(['Date', 'Name', 'Email', 'Phone', 'Service', 'Message'])
        wb.save(EXCEL_FILE)
        print(f"Created {EXCEL_FILE}")

def add_to_excel(data):
    """Add inquiry to Excel file"""
    init_excel()
    
    wb = openpyxl.load_workbook(EXCEL_FILE)
    ws = wb['Inquiries']
    
    ws.append([
        datetime.now().isoformat(),
        data.get('name', ''),
        data.get('email', ''),
        data.get('phone', ''),
        data.get('service', ''),
        data.get('message', '')
    ])
    
    wb.save(EXCEL_FILE)
    print(f"Added inquiry to {EXCEL_FILE}")

def send_email(data):
    """Send email notification"""
    try:
        smtp_host = os.getenv('SMTP_HOST', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', '587'))
        smtp_user = os.getenv('SMTP_USER')
        smtp_pass = os.getenv('SMTP_PASS')
        notification_email = os.getenv('NOTIFICATION_EMAIL', smtp_user)
        
        if not smtp_user or not smtp_pass:
            print("Email not configured. Skipping email notification.")
            return False
        
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = notification_email
        msg['Subject'] = 'New Customer Inquiry - UNIRATH INFOTECH'
        
        body = f"""
        <h2>New Customer Inquiry Received</h2>
        <p><strong>Date:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        <p><strong>Name:</strong> {data.get('name', '')}</p>
        <p><strong>Email:</strong> {data.get('email', '')}</p>
        <p><strong>Phone:</strong> {data.get('phone', 'Not provided')}</p>
        <p><strong>Service Interested In:</strong> {data.get('service', 'Not specified')}</p>
        <p><strong>Message:</strong></p>
        <p>{data.get('message', '')}</p>
        <hr>
        <p><small>This inquiry has been automatically saved to {EXCEL_FILE}</small></p>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)
        server.quit()
        
        print("Email notification sent")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.json
        
        # Validate required fields
        if not data.get('name') or not data.get('email') or not data.get('message'):
            return jsonify({
                'success': False,
                'message': 'Name, email, and message are required fields.'
            }), 400
        
        # Save to Excel
        add_to_excel(data)
        
        # Send email
        email_sent = send_email(data)
        
        return jsonify({
            'success': True,
            'message': 'Thank you for your inquiry! We will get back to you soon.',
            'emailSent': email_sent
        })
    except Exception as e:
        print(f"Error processing contact form: {e}")
        return jsonify({
            'success': False,
            'message': 'An error occurred while processing your request.'
        }), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'Server is running'})

if __name__ == '__main__':
    init_excel()
    port = int(os.getenv('PORT', 3000))
    print(f"Starting server on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)

